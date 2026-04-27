from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app) 

@app.route('/match', methods=['POST'])
def match_items():
    try:
        data = request.json
        
        # 1. Lost Item ka sara data ek string mein combine karna (Accuracy ke liye)
        lost_title = data.get('item_name', '')
        lost_loc = data.get('location', '')
        lost_desc = data.get('lost_desc', '')
        
        lost_combined_text = f"{lost_title} {lost_loc} {lost_desc}".lower()
        
        found_items = data.get('found_items', []) 

        if not found_items:
            return jsonify({"success": True, "matches": []})

        # 2. Database ke har Found Item ka data combine karna
        found_texts = []
        for item in found_items:
            f_title = item.get('title', '')
            f_loc = item.get('location', '')
            f_desc = item.get('description', '')
            combined = f"{f_title} {f_loc} {f_desc}".lower()
            found_texts.append(combined)

        # 3. TF-IDF Vectorization shuru karna
        all_texts = [lost_combined_text] + found_texts
        
        vectorizer = TfidfVectorizer(stop_words='english') # Common words like 'the', 'is' ignore honge
        tfidf_matrix = vectorizer.fit_transform(all_texts)

        # 4. Cosine Similarity calculate karna
        # (Compare index 0 with all other indexes)
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
        scores = cosine_sim[0]

        # 5. Matches filter karna
        matches = []
        for i, score in enumerate(scores):
            # Documentation Requirement: Match percentage display karna
            if score > 0.15: 
                matches.append({
                    # Yahan tabdeeli ki hai: str() add kiya hai taake crash na ho
                    "item_id": str(found_items[i].get('_id', '')),
                    "score": round(float(score), 2),
                    "title": found_items[i].get('title', 'Unknown Item'),
                    "location": found_items[i].get('location', 'N/A'),
                    "city": found_items[i].get('city', 'N/A'),
                    "user": found_items[i].get('user', {}) # User data pass karna claim ke liye zaroori hai
                })

        # Score ke mutabiq sort karna (Highest match pehle)
        matches = sorted(matches, key=lambda x: x['score'], reverse=True)

        return jsonify({
            "success": True, 
            "total_found": len(matches),
            "matches": matches
        })

    except Exception as e:
        print(f"AI ERROR: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Returnify AI Engine is active on Port 5001...")
    app.run(port=5001, debug=True)
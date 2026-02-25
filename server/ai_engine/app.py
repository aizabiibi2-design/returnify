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
        lost_description = data.get('lost_desc', '')
        found_items = data.get('found_items', []) 

        if not found_items:
            return jsonify({"matches": []})

        
        all_descriptions = [lost_description] + [item['description'] for item in found_items]

       
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(all_descriptions)

        
        cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
        
        scores = cosine_sim[0]

        
        matches = []
        for i, score in enumerate(scores):
            
            if score > 0.2: 
                matches.append({
                    "item_id": found_items[i]['_id'],
                    "score": round(float(score), 2),
                    "title": found_items[i].get('title', 'Found Item')
                })

        
        matches = sorted(matches, key=lambda x: x['score'], reverse=True)

        return jsonify({"success": True, "matches": matches})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("AI Matcher Engine is running on port 5001...")
    app.run(port=5001, debug=True)
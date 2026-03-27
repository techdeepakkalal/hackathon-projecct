import io
from flask import Blueprint, request, jsonify
import requests
from config import Config
from utils.jwt_helper import token_required

# ADD THIS NEW ROUTE to your existing mock.py

@mock_bp.route('/transcribe', methods=['POST'])
@token_required(role='user')
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    audio_bytes = audio_file.read()

    if len(audio_bytes) < 500:
        return jsonify({'error': 'Audio too short'}), 400

    try:
        resp = requests.post(
            'https://api.groq.com/openai/v1/audio/transcriptions',
            headers={
                'Authorization': f'Bearer {Config.GROQ_API_KEY}',
            },
            files={
                'file': (audio_file.filename or 'audio.webm', audio_bytes, audio_file.mimetype or 'audio/webm'),
            },
            data={
                'model': 'whisper-large-v3-turbo',   # fast + accurate
                'language': 'en',
                'response_format': 'json',
            },
            timeout=30
        )
        if resp.status_code != 200:
            return jsonify({'error': 'Transcription failed', 'detail': resp.text}), 502
        return jsonify({'text': resp.json().get('text', '')})
    except requests.Timeout:
        return jsonify({'error': 'Transcription timed out'}), 504
    except Exception as e:
        return jsonify({'error': str(e)}), 500
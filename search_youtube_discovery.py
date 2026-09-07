#!/usr/bin/env python3
import json
import sys
from pathlib import Path

sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient

queries = [
    'Caribbean literacy parents teachers interview',
    'Caribbean children authors publishing interview',
    'OECS culturally relevant books literacy talk',
]

client = ApiClient()
rows = []
for q in queries:
    result = client.call_api('Youtube/search', query={'q': q, 'hl': 'en', 'gl': 'US'})
    for item in result.get('contents', []):
        if item.get('type') != 'video':
            continue
        video = item.get('video', {})
        rows.append({
            'query': q,
            'title': video.get('title'),
            'video_id': video.get('videoId'),
            'channel': video.get('channelTitle'),
            'published': video.get('publishedTimeText'),
            'duration': video.get('lengthText'),
            'views': video.get('viewCountText'),
            'description': video.get('descriptionSnippet'),
            'url': f"https://www.youtube.com/watch?v={video.get('videoId')}" if video.get('videoId') else None,
        })

Path('/home/ubuntu/Island-Tales/youtube_discovery_results.json').write_text(json.dumps(rows, indent=2, ensure_ascii=False))
print(f'Saved {len(rows)} video results to youtube_discovery_results.json')

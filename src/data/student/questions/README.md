# Student Questions

학생용 진단 문항 JSON을 정리하는 폴더입니다.

권장 파일 단위:

- `time-control.json`
- `content-quality.json`
- `social-safety.json`
- `game-spending.json`
- `digital-judgment.json`
- `family-communication.json`

문항 스키마 초안:

```json
{
  "id": "student_time_01",
  "order": 1,
  "categoryId": "time_control",
  "question": "문항을 입력해주세요.",
  "options": [
    { "id": "a", "label": "선택지 A", "scoreDelta": 0 },
    { "id": "b", "label": "선택지 B", "scoreDelta": -5 },
    { "id": "c", "label": "선택지 C", "scoreDelta": -10 },
    { "id": "d", "label": "선택지 D", "scoreDelta": -15 }
  ]
}
```

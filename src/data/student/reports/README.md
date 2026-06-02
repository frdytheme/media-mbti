# Student Reports

학생용 결과 리포트 JSON을 정리하는 폴더입니다.

권장 파일 단위:

- `time-control-report.json`
- `content-quality-report.json`
- `social-safety-report.json`
- `game-spending-report.json`
- `digital-judgment-report.json`
- `family-communication-report.json`

리포트 스키마 초안:

```json
{
  "categoryId": "time_control",
  "categoryName": "사용시간 조절력",
  "audience": "student",
  "ranges": [
    {
      "min": 85,
      "max": 100,
      "level": "stable",
      "title": "제목을 입력해주세요.",
      "description": "설명을 입력해주세요.",
      "watchPoint": "실천 포인트를 입력해주세요.",
      "conversationExamples": []
    }
  ]
}
```

# 🎴 Card Realms – SparKing Deckworks

ברוכים הבאים לשער הקלפים של GameForge. כאן מגדירים כל משחק קלפים לפי שפה אחידה: Card ID, Type, Effect, Lore וכללי סינרגיה בין סטים.

## 🗺️ מה יש פה?
- `docs/` – חוקים מורחבים, דפי Reference ותרשימי זרימה.
- `prototypes/` – קבצי JSON/Markdown עם סקיצות לקלפים וסטים.
- `assets/` – מסגרות, רקעים ואייקונים בסגנון SparKing (מוכן להוספת גרפיקות).

## 🧩 תבנית קלף בסיסית
כל קלף נבנה סביב שדות קבועים:

```json
{
  "id": "GF-CR-01",
  "title": "Spark Initiate",
  "type": "Support",
  "cost": 1,
  "effect": "Gain 1 Energy and draw 1 card.",
  "lore": "A flicker that awakens the forge.",
  "tags": ["starter", "energy"]
}
```

## 🃏 משחק הדגל: SparKing Ascension (Starter Set)
- **פוקוס:** משחק זריז של צבירת אנרגיה וניצוצות כדי לפתוח "שערים".
- **מספר שחקנים:** 2–4.
- **משך סבב:** 10–15 דקות.
- **תנאי ניצחון:** להגיע ל־7 Spark Points לפני היריב.
- **מבנה חבילה:** 20 קלפים – רשימת קלפים מלאה בקובץ [`prototypes/sparking-ascension-starter.json`](./prototypes/sparking-ascension-starter.json).

### לופ משחק מהיר
1. **Draw** – משוך קלף אחד.
2. **Charge** – שחק קלף אחד (Attack/Support/Event/Realm).
3. **Resolve** – יישום אפקטים, ספירת ניצוצות ואנרגיה.
4. **Ascend** – אם צברת 3 Energy באותו סיבוב, פתח "Gate" לקבלת יתרון קבוע (ראו [`docs/sparking-ascension-rules.md`](./docs/sparking-ascension-rules.md)).

### מינימום להתחלה
- דפדף בקובץ החוקים.
- הדפס/כתוב את הקלפים מה־JSON או העתק אותם לכלי כמו Notion/TTS.
- שחק סיבוב ניסיון, עדכן חוקים בהתאם לחוויית המשחק.

## 🔌 איך להרחיב?
- הוספת Deck חדש: צור קובץ JSON ב־`prototypes/` עם מזהה Deck חדש.
- הוספת מצב משחק: הוסף מסמך חוקים ב־`docs/` והגדר Card Tags תואמים.
- הוספת אמנות: הוסף קבצי SVG/PNG ב־`assets/` וקשר אותם לשדה `art` בקובצי ה־JSON.

Happy forging! ⚡

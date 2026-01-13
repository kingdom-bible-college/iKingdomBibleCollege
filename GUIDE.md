# 🚀 사용 가이드

이 문서는 프로젝트에서 **자주 하는 작업별로 어디에 무엇을 만들어야 하는지** 안내합니다.

---

## 📍 빠른 참조표

| 하고 싶은 것 | 만들 위치 | 예시 |
|-------------|----------|------|
| 새 페이지 추가 | `src/app/[경로]/page.tsx` | `src/app/words/page.tsx` |
| DB 테이블 추가 | `src/db/schema.ts` | `words` 테이블 정의 |
| DB 쿼리 함수 | `src/db/queries/[도메인].ts` | `queries/words.ts` |
| 재사용 컴포넌트 | `src/components/` | `WordCard.tsx` |
| 유틸 함수 | `src/lib/` | `utils.ts` |

---

## 1️⃣ 새 페이지 만들기

### 기본 페이지
```bash
# /words 경로의 페이지 생성
src/app/words/page.tsx
```

```typescript
// src/app/words/page.tsx
export default function WordsPage() {
  return <h1>단어 목록</h1>;
}
```

### 동적 라우트 (예: /words/123)
```bash
src/app/words/[id]/page.tsx
```

```typescript
// src/app/words/[id]/page.tsx
export default async function WordDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <h1>단어 #{id}</h1>;
}
```

---

## 2️⃣ DB 테이블 추가하기

### Step 1: 스키마 정의
```typescript
// src/db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const words = pgTable('words', {
  id: serial('id').primaryKey(),
  term: text('term').notNull(),
  definition: text('definition').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Step 2: 마이그레이션 생성 & 적용
```bash
# 마이그레이션 파일 생성
pnpm drizzle-kit generate

# DB에 적용 (개발용)
pnpm drizzle-kit push
```

### Step 3: 타입 활용
```typescript
import { words } from '@/db/schema';

// 자동 생성된 타입 사용
type Word = typeof words.$inferSelect;      // 조회용
type NewWord = typeof words.$inferInsert;   // 삽입용
```

---

## 3️⃣ DB 쿼리 함수 만들기 (DAL)

```typescript
// src/db/queries/words.ts
import 'server-only';
import { db } from '@/db';
import { words } from '@/db/schema';
import { eq } from 'drizzle-orm';

// 전체 조회
export async function getAllWords() {
  return db.select().from(words);
}

// 단일 조회
export async function getWordById(id: number) {
  const result = await db.select().from(words).where(eq(words.id, id));
  return result[0] ?? null;
}

// 생성
export async function createWord(term: string, definition: string) {
  return db.insert(words).values({ term, definition }).returning();
}

// 삭제
export async function deleteWord(id: number) {
  return db.delete(words).where(eq(words.id, id));
}
```

---

## 4️⃣ 페이지에서 데이터 사용하기

```typescript
// src/app/words/page.tsx
import { getAllWords } from '@/db/queries/words';

export default async function WordsPage() {
  const words = await getAllWords();  // 서버에서 직접 호출!
  
  return (
    <ul>
      {words.map((word) => (
        <li key={word.id}>{word.term}: {word.definition}</li>
      ))}
    </ul>
  );
}
```

> ⚠️ **주의**: `page.tsx`에서 직접 `db.select()` 호출 금지!  
> 반드시 `queries/` 폴더의 함수를 통해 접근하세요.

---

## 5️⃣ 컴포넌트 만들기

### 서버 컴포넌트 (기본)
```typescript
// src/components/WordCard.tsx
type Props = {
  term: string;
  definition: string;
};

export function WordCard({ term, definition }: Props) {
  return (
    <div className="card">
      <h3>{term}</h3>
      <p>{definition}</p>
    </div>
  );
}
```

### 클라이언트 컴포넌트 (인터랙션 필요 시)
```typescript
// src/components/LikeButton.tsx
'use client';  // 맨 위에 선언!

import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

---

## 6️⃣ 자주 쓰는 명령어

```bash
# 개발 서버 실행
pnpm dev

# DB 스키마 변경 후
pnpm drizzle-kit generate  # 마이그레이션 생성
pnpm drizzle-kit push      # DB에 적용

# Drizzle Studio (DB GUI)
pnpm drizzle-kit studio

# 타입 체크
pnpm tsc --noEmit

# 린트
pnpm lint
```

---

## 📂 전체 구조 요약

```
src/
├── app/                    # 🌐 페이지 & 라우팅
│   ├── layout.tsx          # 공통 레이아웃
│   ├── page.tsx            # 홈페이지 (/)
│   └── words/
│       ├── page.tsx        # /words
│       └── [id]/page.tsx   # /words/:id
│
├── components/             # 🧩 재사용 컴포넌트
│   ├── ui/                 # 기본 UI (Button, Input)
│   └── WordCard.tsx        # 도메인 컴포넌트
│
├── db/                     # 🗄️ 데이터베이스
│   ├── index.ts            # Drizzle 클라이언트 (수정 X)
│   ├── schema.ts           # 테이블 정의
│   └── queries/            # DAL 쿼리 함수
│       ├── users.ts
│       └── words.ts
│
└── lib/                    # 🔧 유틸리티
    └── utils.ts
```

---

## 💡 개발 흐름 예시

**"단어장 기능을 추가하고 싶어요"**

1. `src/db/schema.ts` → `words` 테이블 추가
2. `pnpm drizzle-kit generate && pnpm drizzle-kit push`
3. `src/db/queries/words.ts` → CRUD 함수 작성
4. `src/app/words/page.tsx` → 단어 목록 페이지
5. `src/components/WordCard.tsx` → UI 컴포넌트 (필요시)

이 순서대로 진행하면 됩니다! 🎯

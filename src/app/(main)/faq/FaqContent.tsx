'use client';

import { useState } from 'react';
import styles from './page.module.css';

type CategoryId = 'account' | 'course' | 'admission' | 'curriculum' | 'support';

interface FaqItem {
  question: string;
  answer: string;
}

interface Category {
  id: CategoryId;
  label: string;
  items: FaqItem[];
}

const categories: Category[] = [
  {
    id: 'account',
    label: '회원가입/로그인',
    items: [
      {
        question: '회원가입은 어떻게 하나요?',
        answer:
          '홈페이지 우측 상단 \'회원가입\' 버튼을 클릭하여 이름, 이메일, 비밀번호를 입력하면 가입됩니다.',
      },
      {
        question: '가입 후 바로 로그인할 수 있나요?',
        answer:
          '아닙니다. 가입 후 관리자 승인이 필요합니다. 승인이 완료되면 로그인이 가능합니다.',
      },
      {
        question: '승인은 얼마나 걸리나요?',
        answer:
          '영업일 기준 1~2일 이내 처리됩니다. 급한 경우 아래 연락처로 문의해주세요.',
      },
      {
        question: '비밀번호를 잊어버렸어요.',
        answer:
          '현재 비밀번호 재설정 기능은 준비 중입니다. 이메일(ikingdombiblecollege@gmail.com)로 문의해주세요.',
      },
      {
        question: '로그인 상태는 얼마나 유지되나요?',
        answer:
          '로그인 후 14일간 유지됩니다. 이후 다시 로그인하시면 됩니다.',
      },
    ],
  },
  {
    id: 'course',
    label: '수강',
    items: [
      {
        question: '강의는 어떻게 수강하나요?',
        answer:
          '로그인 후 \'강의\' 메뉴에서 원하는 과목을 선택하면 커리큘럼과 영상을 볼 수 있습니다.',
      },
      {
        question: '수강 기한이 있나요?',
        answer:
          '수강 기한은 무제한입니다. 승인된 회원은 언제든 다시 시청할 수 있습니다.',
      },
      {
        question: '강의 영상을 다운로드할 수 있나요?',
        answer:
          '영상 다운로드는 지원되지 않습니다. 온라인 스트리밍으로만 시청 가능합니다.',
      },
      {
        question: "'잠김' 표시가 된 강의는 무엇인가요?",
        answer:
          '회원 전용 콘텐츠입니다. 로그인 및 승인이 완료된 회원만 시청할 수 있습니다.',
      },
      {
        question: "'미리보기' 강의는 무엇인가요?",
        answer:
          '비회원도 무료로 시청할 수 있는 샘플 강의입니다.',
      },
      {
        question: '모바일에서도 수강할 수 있나요?',
        answer:
          '네, 모바일 웹브라우저(Chrome, Safari 등)에서 수강 가능합니다. 별도 앱은 없습니다.',
      },
      {
        question: '영상이 재생되지 않아요.',
        answer:
          '인터넷 연결을 확인해주세요. Chrome 또는 Safari 최신 버전 사용을 권장합니다. 문제가 지속되면 문의해주세요.',
      },
    ],
  },
  {
    id: 'admission',
    label: '입학/등록',
    items: [
      {
        question: '2026학년도 등록 기간은 언제인가요?',
        answer:
          '등록 마감일은 3월 6일(금)이며, 수업은 3월 17일 ~ 6월 18일(18주)입니다.',
      },
      {
        question: '수강료는 얼마인가요?',
        answer:
          '정가 480,000원이며, 조기등록 시 400,000원입니다.',
      },
      {
        question: '수강료 납부는 어떻게 하나요?',
        answer:
          '국민은행 461301-04-610726 (예금주: 비전스테이션미니스트리) 계좌로 입금해주세요. 입금 후 연락 부탁드립니다.',
      },
      {
        question: '환불이 가능한가요?',
        answer:
          '환불 관련 사항은 이메일 또는 전화로 문의해주세요.',
      },
      {
        question: '수료 조건은 무엇인가요?',
        answer:
          '출석률 80% 이상 및 킹덤 컨퍼런스 참석이 수료 조건입니다.',
      },
      {
        question: '수료증이 발급되나요?',
        answer:
          '수료 조건 충족 시 수료증이 발급됩니다. 자세한 사항은 문의해주세요.',
      },
    ],
  },
  {
    id: 'curriculum',
    label: '교육과정',
    items: [
      {
        question: '어떤 과정이 있나요?',
        answer:
          '성경대학, 상담대학, 영성대학, 선교현장대학 총 4개 칼리지로 운영됩니다.',
      },
      {
        question: '수강에 선수 과목이 필요한가요?',
        answer:
          '별도 선수 과목은 없습니다. 각 과정의 난이도는 강의 상세 페이지에서 확인할 수 있습니다.',
      },
      {
        question: '강사진은 누구인가요?',
        answer:
          "황성은 목사, 김태현 목사 등이 출강하며, 온라인 강사진도 함께합니다. 자세한 내용은 'KBC 소개' 페이지에서 확인하세요.",
      },
      {
        question: '학점 인정이 되나요?',
        answer:
          '협력기관인 미성대학교(America Evangelical University)와 학점 교류가 가능합니다. 상세 사항은 문의해주세요.',
      },
    ],
  },
  {
    id: 'support',
    label: '문의/지원',
    items: [
      {
        question: '문의는 어디로 하나요?',
        answer: '이메일: ikingdombiblecollege@gmail.com 으로 문의해주세요.',
      },
      {
        question: '전화 문의가 가능한가요?',
        answer:
          '대표전화 042-824-3242 또는 사무처장 도현우 (010-3542-3703), 간사 전미라 (010-8966-0558)로 연락해주세요.',
      },
      {
        question: '방문 상담이 가능한가요?',
        answer:
          '대전 서구 도안중로 304-10 (도안동 1483)에서 방문 상담이 가능합니다. 방문 전 전화로 예약해주시면 더 원활한 상담이 가능합니다.',
      },
      {
        question: '협력기관(MOU)은 어떤 곳이 있나요?',
        answer:
          '미성대학교, 한국창조과학회, 드림스드림, 열방대학 YWAM, 갈보리채플바이블칼리지 등이 있습니다. 자세한 내용은 \'KBC 소개\' 페이지에서 확인하세요.',
      },
    ],
  },
];

export default function FaqContent() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('account');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeItems = categories.find((c) => c.id === activeCategory)?.items ?? [];

  function handleCategoryChange(id: CategoryId) {
    setActiveCategory(id);
    setOpenIndex(null);
  }

  function handleToggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section className={styles.faqSection}>
      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryTab} ${activeCategory === cat.id ? styles.categoryTabActive : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
            <span className={styles.categoryCount}>{cat.items.length}</span>
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className={styles.accordionList}>
        {activeItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ''}`}
            >
              <button
                className={styles.accordionQuestion}
                onClick={() => handleToggle(index)}
                aria-expanded={isOpen}
              >
                <span className={styles.questionMark}>Q.</span>
                <span className={styles.questionText}>{item.question}</span>
                <span className={`${styles.accordionIcon} ${isOpen ? styles.accordionIconOpen : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div
                className={styles.accordionAnswer}
                style={{
                  maxHeight: isOpen ? '200px' : '0',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className={styles.answerInner}>
                  <span className={styles.answerMark}>A.</span>
                  <span className={styles.answerText}>{item.answer}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

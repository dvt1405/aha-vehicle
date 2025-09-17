"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// --- Types ---
type Point = { x: number; y: number };
type StopType = "pickup" | "dropoff";
type OrderStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
type Stop = {
  id: string;
  type: StopType;
  location: Point;
  question: Question;
  answered: boolean;
};
type Order = {
  id: string;
  stops: Stop[];
  prize: number;
};
type Question = {
  text: string;
  options: string[];
  answer: number; // index of correct answer
};

// --- Helpers ---
const MAP_W = 700, MAP_H = 400;
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const uid = () => Math.random().toString(36).slice(2, 10);

// Real Ahamove Order Dispatch & POW questions (Vietnamese translations)
const QUESTIONS: Question[] = [
  {
    text: "Bạn nên làm gì trước khi nhận đơn hàng?",
    options: [
      "Kiểm tra địa điểm nhận/giao và tình trạng sẵn sàng của mình",
      "Nhận tất cả đơn hàng bất kể tình huống của bạn",
      "Bỏ qua chi tiết đơn hàng",
      "Nhận và hủy nếu bận",
    ],
    answer: 0,
  },
  {
    text: "Tại điểm nhận hàng, hành động đúng là gì?",
    options: [
      "Xác nhận chi tiết đơn hàng với người gửi và nhận gói hàng",
      "Đi thẳng đến điểm giao",
      "Nghỉ ngơi",
      "Rời đi nếu người gửi không có mặt ngay",
    ],
    answer: 0,
  },
  {
    text: "Điều gì cần thiết cho Bằng Chứng Nhận Hàng?",
    options: [
      "Chụp ảnh rõ ràng gói hàng hoặc quét QR nếu được yêu cầu",
      "Chỉ cần nói 'đã nhận' trong app",
      "Bỏ qua bước này",
      "Gọi cho người nhận",
    ],
    answer: 0,
  },
  {
    text: "Làm thế nào để cung cấp Bằng Chứng Giao Hàng?",
    options: [
      "Chụp ảnh tại điểm giao hoặc nhập mã giao hàng",
      "Chỉ gọi cho người gửi",
      "Để gói hàng và đi",
      "Bỏ qua xác nhận",
    ],
    answer: 0,
  },
  {
    text: "Nếu bạn không thể hoàn thành đơn hàng, bạn nên làm gì?",
    options: [
      "Liên hệ hỗ trợ và giải thích tình huống",
      "Hủy mà không thông báo",
      "Giao đến một địa chỉ ngẫu nhiên",
      "Bỏ qua đơn hàng",
    ],
    answer: 0,
  },
  {
    text: "Điều gì xảy ra nếu bạn hủy quá nhiều đơn hàng?",
    options: [
      "Danh tiếng và ưu đãi của bạn có thể giảm",
      "Bạn nhận được nhiều xu hơn",
      "Bạn nhận được tiền thưởng",
      "Không có gì xảy ra",
    ],
    answer: 0,
  },
  {
    text: "Bạn nên làm gì nếu không thể tìm thấy địa điểm nhận hoặc giao hàng?",
    options: [
      "Liên hệ với người gửi hoặc người nhận để làm rõ",
      "Bỏ qua đơn hàng",
      "Đoán địa chỉ",
      "Hủy ngay lập tức",
    ],
    answer: 0,
  },
  {
    text: "Có được phép làm giả ảnh hoặc mã cho Bằng Chứng Công Việc không?",
    options: [
      "Không, luôn cung cấp bằng chứng trung thực theo yêu cầu",
      "Có, nếu đang vội",
      "Chỉ khi app cho phép",
      "Thỉnh thoảng",
    ],
    answer: 0,
  },
];

// Generate a random stop with a random question
function randomStop(type: StopType): Stop {
  const location = { x: rand(60, MAP_W - 60), y: rand(60, MAP_H - 60) };
  const question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  return {
    id: uid(),
    type,
    location,
    question,
    answered: false,
  };
}

// Generate an order with multiple stops (e.g., 2 pickups, 2 dropoffs)
function randomOrder(): Order {
  const stops: Stop[] = [
    randomStop("pickup"),
    randomStop("pickup"),
    randomStop("dropoff"),
    randomStop("dropoff"),
  ];
  // Ensure stops are not too close to each other
  for (let i = 1; i < stops.length; i++) {
    while (dist(stops[i].location, stops[i - 1].location) < 100) {
      stops[i].location = { x: rand(60, MAP_W - 60), y: rand(60, MAP_H - 60) };
    }
  }
  return {
    id: uid(),
    stops,
    prize: Math.round(rand(80, 160)),
  };
}

function moveToward(a: Point, b: Point, speed: number): Point {
  const d = dist(a, b);
  if (d === 0 || speed >= d) return { ...b };
  const t = speed / d;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// --- POW Quiz Modal ---
function POWQuizModal({
  open,
  stop,
  onAnswer,
}: {
  open: boolean;
  stop: Stop | null;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    setSelected(null);
  }, [open, stop?.id]);
  if (!open || !stop) return null;
  return (
    <div className="fixed inset-0 z-30 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-xs flex flex-col items-center">
        <div className="text-3xl mb-2">
          {stop.type === "pickup" ? "🏬" : "🏠"}
        </div>
        <div className="font-bold text-lg mb-2 text-blue-700 text-center">{stop.question.text}</div>
        <div className="flex flex-col gap-2 w-full">
          {stop.question.options.map((opt, idx) => (
            <button
              key={idx}
              className={`px-3 py-2 rounded-lg border font-semibold text-sm transition-all
                ${selected === idx
                  ? idx === stop.question.answer
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-red-100 border-red-400 text-red-700"
                  : "bg-gray-50 border-gray-200 hover:bg-blue-50"}
              `}
              disabled={selected !== null}
              onClick={() => {
                setSelected(idx);
                setTimeout(() => onAnswer(idx === stop.question.answer), 700);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function OrderDispatchSimulator() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>(() => [randomOrder()]);
  const [driver, setDriver] = useState<Point>({ x: MAP_W / 2, y: MAP_H / 2 });
  const [status, setStatus] = useState<OrderStatus>("AVAILABLE");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentStopIdx, setCurrentStopIdx] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStop, setQuizStop] = useState<Stop | null>(null);
  const animRef = useRef<number | undefined>(undefined);

  // Animation loop
  useEffect(() => {
    if (status !== "IN_PROGRESS" || !currentOrder) return;
    let last = performance.now();
    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      setDriver((pos) => {
        if (!currentOrder) return pos;
        const stop = currentOrder.stops[currentStopIdx];
        if (!stop) return pos;
        const next = moveToward(pos, stop.location, 180 * dt);
        if (dist(next, stop.location) < 10 && !stop.answered && !quizOpen) {
          setQuizStop(stop);
          setQuizOpen(true);
        }
        return next;
      });
      animRef.current = requestAnimationFrame(frame);
    }
    animRef.current = requestAnimationFrame(frame);
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
    // eslint-disable-next-line
  }, [currentOrder, status, currentStopIdx, quizOpen]);

  // Accept order
  function acceptOrder(order: Order) {
    if (status !== "AVAILABLE") return;
    setCurrentOrder(order);
    setStatus("IN_PROGRESS");
    setCurrentStopIdx(0);
    setMsg("Drive to the first stop!");
  }

  // Handle quiz answer
  function handleQuizAnswer(correct: boolean) {
    setQuizOpen(false);
    if (!currentOrder) return;
    const stops = currentOrder.stops.map((s, i) =>
      i === currentStopIdx ? { ...s, answered: true } : s
    );
    setCurrentOrder({ ...currentOrder, stops });
    if (correct) {
      setScore((s) => s + 1);
      setMsg("✅ Correct! Proceed to next stop.");
    } else {
      setMsg("❌ Wrong answer. Try to do better next stop!");
    }
    // Move to next stop or finish
    if (currentStopIdx < stops.length - 1) {
      setTimeout(() => {
        setCurrentStopIdx((idx) => idx + 1);
        setMsg("Drive to the next stop!");
      }, 900);
    } else {
      setStatus("COMPLETED");
      setMsg(`Order complete! Total score: ${score + (correct ? 1 : 0)} / ${stops.length}`);
    }
  }

  // Reset game
  function reset() {
    setOrders([randomOrder()]);
    setDriver({ x: MAP_W / 2, y: MAP_H / 2 });
    setCurrentOrder(null);
    setCurrentStopIdx(0);
    setStatus("AVAILABLE");
    setScore(0);
    setMsg(null);
    setQuizOpen(false);
    setQuizStop(null);
  }

  // --- Render ---
  const stops = currentOrder?.stops ?? [];
  const currentStop = stops[currentStopIdx];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-orange-50 py-8 px-2">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-orange-600 drop-shadow">{t('orderDispatchSimulator')}</h1>
      <div className="mb-6 max-w-xl bg-white/80 rounded-xl shadow p-4 border-l-4 border-blue-400 text-left">
        <h2 className="font-bold text-blue-700 mb-2 text-lg flex items-center gap-2">
          <span>📜</span> {t('proofOfWorkChallenge')}
        </h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
          <li>{t('challengeDescription1')}</li>
          <li>{t('challengeDescription2')}</li>
          <li>{t('challengeDescription3')}</li>
        </ul>
      </div>
      <div className="mb-2 text-lg font-bold text-gray-700">
        {t('score')}: <span className="text-yellow-500">{score}</span>
      </div>
      {msg && <div className="mb-2 text-base font-bold text-blue-700 animate-bounce">{msg}</div>}
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Map */}
        <svg width={MAP_W} height={MAP_H} className="rounded-2xl shadow-xl bg-white border border-blue-200 mx-auto block">
          {/* Route lines */}
          {stops.length > 1 && stops.map((stop, idx) => {
            if (idx === 0) return null;
            const prev = stops[idx - 1];
            return (
              <line
                key={stop.id + "-route"}
                x1={prev.location.x}
                y1={prev.location.y}
                x2={stop.location.x}
                y2={stop.location.y}
                stroke="#38bdf8"
                strokeWidth={5}
                strokeDasharray="10 8"
                opacity={0.45}
              />
            );
          })}
          {/* Stops with distinct icons */}
          {stops.map((stop, idx) => (
            <g key={stop.id}>
              <circle
                cx={stop.location.x}
                cy={stop.location.y}
                r={26}
                fill={stop.type === "pickup" ? "#38bdf8" : "#fbbf24"}
                stroke={stop.type === "pickup" ? "#0ea5e9" : "#f59e42"}
                strokeWidth={4}
                opacity={idx === currentStopIdx ? 1 : 0.7}
                filter={idx === currentStopIdx ? "url(#glow)" : undefined}
              />
              <text
                x={stop.location.x}
                y={stop.location.y + 10}
                textAnchor="middle"
                fontSize={stop.type === "pickup" ? 32 : 32}
                fontWeight={700}
                fill="#fff"
                style={{ pointerEvents: "none" }}
              >
                {stop.type === "pickup" ? "🏬" : "🏠"}
              </text>
            </g>
          ))}
          {/* Driver */}
          {status !== "AVAILABLE" && currentStop && (
            <g>
              <circle
                cx={driver.x}
                cy={driver.y}
                r={18}
                fill="#fb923c"
                stroke="#ea580c"
                strokeWidth={4}
                filter="url(#shadow)"
              />
              <text x={driver.x} y={driver.y + 7} textAnchor="middle" fontSize={18} fill="#fff" fontWeight={700}>🛵</text>
            </g>
          )}
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.18" />
            </filter>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fbbf24" floodOpacity="0.7" />
            </filter>
          </defs>
        </svg>
        {/* Accept Order Button - Centered and Bigger */}
        {status === "AVAILABLE" && orders.length > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 flex justify-center w-full">
            <button
              onClick={() => acceptOrder(orders[0])}
              className="px-8 py-5 rounded-2xl font-extrabold text-xl shadow-2xl bg-gradient-to-r from-orange-400 to-orange-500 text-white border-4 border-orange-200 hover:scale-105 hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
              style={{ minWidth: 260 }}
            >
{t('acceptOrder')} <span className="font-black text-yellow-200">+{orders[0].prize}</span>
            </button>
          </div>
        )}
        {/* Reset Button */}
        {status === "COMPLETED" && (
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white font-extrabold shadow-lg hover:bg-orange-600 transition-all"
            >
{t('playAgain')}
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 text-gray-500 text-xs max-w-lg text-center">
        {t('gameInstructions')}
      </div>
      {/* POW Quiz Modal */}
      <POWQuizModal
        open={quizOpen}
        stop={quizStop}
        onAnswer={handleQuizAnswer}
      />
    </div>
  );
}

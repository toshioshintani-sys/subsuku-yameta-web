// アイコン中央レジストリ（Phase A：Lucide ベース）
//
// 設計：
//   - 絵文字 → 高品質ベクター（Lucide）への移行
//   - カテゴリ・ジャンル・UI・サービス用途別に分けて管理
//   - サイズと色は呼び出し側で props 指定（一貫性のため CSS 変数を活用推奨）

import {
  // カテゴリ・ジャンル
  Tv,
  Music,
  ShoppingBag,
  Laptop,
  Newspaper,
  Gamepad2,
  Box,
  Flower2,
  Shirt,
  UtensilsCrossed,
  Droplets,
  Coffee,
  BookOpen,
  Baby,
  Wine,
  // UI・ナビゲーション
  Scissors,
  LayoutGrid,
  ListChecks,
  FileText,
  Home,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  // 状態・ナッジ
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Sparkles,
  // 棚卸し・データ
  BarChart3,
  Calculator,
  Wallet,
  Receipt,
  // 共有
  Share2,
  Copy,
  // その他
  Search,
  X,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';

// カテゴリ → アイコン
const CATEGORY_ICON = {
  all: LayoutGrid,
  video: Tv,
  music: Music,
  shopping: ShoppingBag,
  software: Laptop,
  news: Newspaper,
  game: Gamepad2,
  other: Box,
};

// discover ジャンル → アイコン
const DISCOVER_ICON = {
  flower: Flower2,
  'fashion-rental': Shirt,
  'frozen-meal': UtensilsCrossed,
  'water-server': Droplets,
  'coffee-subscription': Coffee,
  learning: BookOpen,
  'kids-toy': Baby,
  'sake-subscription': Wine,
};

// UI 用途別エイリアス（意味で呼び出せるように）
const UI_ICON = {
  cancel: Scissors,
  home: Home,
  catalog: LayoutGrid,
  tracker: ListChecks,
  blog: FileText,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  externalLink: ExternalLink,
  loss: TrendingDown,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
  alert: CircleAlert,
  hint: Lightbulb,
  graduation: Sparkles,
  stats: BarChart3,
  calculator: Calculator,
  wallet: Wallet,
  receipt: Receipt,
  share: Share2,
  copy: Copy,
  search: Search,
  close: X,
  menu: Menu,
  sun: Sun,
  moon: Moon,
};

/**
 * 共通スタイルのアイコンラッパー
 * 使い方：<Icon name="cancel" size={20} />
 */
export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75, className, ...rest }) {
  const Cmp = UI_ICON[name];
  if (!Cmp) return null;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} className={className} {...rest} />;
}

/**
 * カテゴリアイコン
 */
export function CategoryIcon({ categoryId, size = 22, ...rest }) {
  const Cmp = CATEGORY_ICON[categoryId] || Box;
  return <Cmp size={size} strokeWidth={1.6} {...rest} />;
}

/**
 * Discover ジャンルアイコン
 */
export function DiscoverIcon({ genreId, size = 28, ...rest }) {
  const Cmp = DISCOVER_ICON[genreId] || Box;
  return <Cmp size={size} strokeWidth={1.5} {...rest} />;
}

// 個別エクスポート（ServiceIcon リファクタ用にも使う）
export {
  Tv,
  Music,
  ShoppingBag,
  Laptop,
  Newspaper,
  Gamepad2,
  Box,
  Flower2,
  Shirt,
  UtensilsCrossed,
  Droplets,
  Coffee,
  BookOpen,
  Baby,
  Wine,
  Scissors,
  LayoutGrid,
  ListChecks,
  FileText,
  Home,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  BarChart3,
  Calculator,
  Wallet,
  Share2,
  Copy,
  Search,
  Sun,
  Moon,
};

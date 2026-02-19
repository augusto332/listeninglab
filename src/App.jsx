import logo from "@/assets/logo.png"
import { useState, useEffect, useMemo, useRef, useReducer } from "react"
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import MentionCard from "@/components/MentionCard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import RightSidebar from "@/components/RightSidebar"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/context/AuthContext"
import ConfigPage from "./ConfigPage"
import SidebarNavigation from "./components/SidebarNavigation"
import DashboardPage from "./DashboardPage"
import ReportsPage from "./ReportsPage"
import AlertsPage from "./AlertsPage"
import {
  Search,
  CircleUser,
  Star,
  CircleHelp,
  MessageSquare,
  ChevronDown,
  LogOut,
  Headset,
  Menu,
  Bell,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import KeywordTable from "@/components/KeywordTable"
import ReportsTable from "@/components/ReportsTable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import AISummary from "@/components/AISummary"
import NotificationsMenu from "./components/NotificationsMenu"

const normalizeQualitativeTags = (mention) =>
  Array.isArray(mention?.qualitative_tags)
    ? mention.qualitative_tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
    : []

const DEFAULT_SENTIMENT_OPTIONS = ["positive", "neutral", "negative"]

export default function ModernSocialListeningApp({ onLogout }) {
  // All your existing state variables remain the same
  const createEmptyMetricsFilter = () => ({
    likes: { min: null, max: null },
    views: { min: null, max: null },
    comments: { min: null, max: null },
    retweets: { min: null, max: null },
    replies: { min: null, max: null },
    quotes: { min: null, max: null },
  })

  const filterReducer = (state, action) => {
    switch (action.type) {
      case "SET_SEARCH":
        return { ...state, search: action.payload }
      case "SET_SOURCES":
        return { ...state, sourcesFilter: action.payload }
      case "SET_KEYWORDS":
        return { ...state, keywordsFilter: action.payload }
      case "SET_TAGS":
        return { ...state, tagsFilter: action.payload }
      case "SET_AI_TAGS":
        return { ...state, aiTagsFilter: action.payload }
      case "SET_SENTIMENT":
        return { ...state, sentimentFilter: action.payload }
      case "SET_ORDER":
        return { ...state, order: action.payload }
      case "SET_ONLY_FAVORITES":
        return { ...state, onlyFavorites: action.payload }
      case "SET_METRICS":
        return { ...state, metricsFilter: action.payload }
      case "UPDATE_METRIC_RANGE": {
        const { metricKey, bound, value } = action.payload
        return {
          ...state,
          metricsFilter: {
            ...state.metricsFilter,
            [metricKey]: {
              ...state.metricsFilter?.[metricKey],
              [bound]: value,
            },
          },
        }
      }
      default:
        return state
    }
  }

  const [filterState, dispatchFilter] = useReducer(filterReducer, {
    search: "",
    sourcesFilter: [],
    keywordsFilter: ["all"],
    tagsFilter: [],
    aiTagsFilter: [],
    sentimentFilter: [],
    order: "recent",
    onlyFavorites: false,
    metricsFilter: createEmptyMetricsFilter(),
  })
  const {
    search,
    sourcesFilter,
    keywordsFilter,
    tagsFilter,
    aiTagsFilter,
    sentimentFilter,
    order,
    onlyFavorites,
    metricsFilter,
  } = filterState
  const setSearch = (value) => dispatchFilter({ type: "SET_SEARCH", payload: value })
  const setSourcesFilter = (value) => dispatchFilter({ type: "SET_SOURCES", payload: value })
  const setKeywordsFilter = (value) => dispatchFilter({ type: "SET_KEYWORDS", payload: value })
  const setTagsFilter = (value) => dispatchFilter({ type: "SET_TAGS", payload: value })
  const setAiTagsFilter = (value) => dispatchFilter({ type: "SET_AI_TAGS", payload: value })
  const setSentimentFilter = (value) => dispatchFilter({ type: "SET_SENTIMENT", payload: value })
  const setOrder = (value) => dispatchFilter({ type: "SET_ORDER", payload: value })
  const setOnlyFavorites = (value) => dispatchFilter({ type: "SET_ONLY_FAVORITES", payload: value })
  const setMetricsFilter = (value) => dispatchFilter({ type: "SET_METRICS", payload: value })
  const updateMetricRange = (metricKey, bound, value) =>
    dispatchFilter({ type: "UPDATE_METRIC_RANGE", payload: { metricKey, bound, value } })

  const [mentions, setMentions] = useState([])
  const [mentionsLoading, setMentionsLoading] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const sentinelRef = useRef(null)
  const loadedMentionIdsRef = useRef(new Set())
  const [menuOpen, setMenuOpen] = useState(false)
  const [helpMenuOpen, setHelpMenuOpen] = useState(false)
  const helpMenuRef = useRef(null)
  const userMenuRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [allAiTagOptions, setAllAiTagOptions] = useState([])
  const [allSentimentOptions, setAllSentimentOptions] = useState([])
  const [hiddenMentions, setHiddenMentions] = useState([])
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState("")
  const [addKeywordMessage, setAddKeywordMessage] = useState(null)
  const [saveKeywordMessage, setSaveKeywordMessage] = useState(null)
  const [keywordChanges, setKeywordChanges] = useState({})
  const [accountSettingsVersion, setAccountSettingsVersion] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const [reportStartDate, setReportStartDate] = useState("")
  const [reportEndDate, setReportEndDate] = useState("")
  const [reportPlatform, setReportPlatform] = useState("")
  const [savedReports, setSavedReports] = useState([])
  const [showReportForm, setShowReportForm] = useState(false)
  const [showReportTypeSelector, setShowReportTypeSelector] = useState(false)
  const [reportFormType, setReportFormType] = useState("standard")
  const [newReportName, setNewReportName] = useState("")
  const [reportKeyword, setReportKeyword] = useState("")
  const [reportDateOption, setReportDateOption] = useState("range")
  const mainContentRef = useRef(null)
  const DEFAULT_REPORT_TIMEZONE = "-05:00"
  const AI_REPORT_NAME = "Resumen semanal"
  const AI_REPORT_DATE_PRESET = "7"
  const AI_REPORT_SCHEDULE = "weekly"
  const AI_REPORT_SCHEDULE_DAY = 1
  const AI_REPORT_SCHEDULE_TIME = "09:00"
  const [reportEmailRecipients, setReportEmailRecipients] = useState([])
  const [reportEmailRecipientInput, setReportEmailRecipientInput] = useState("")
  const [reportMessage, setReportMessage] = useState(null)
  const [editingReportId, setEditingReportId] = useState(null)
  const { user, accountId, role } = useAuth()
  const isAdmin = role?.toLowerCase?.() === "admin"
  const avatarDisplayName = user?.user_metadata?.display_name || user?.email || ""
  const avatarLabel = avatarDisplayName ? avatarDisplayName.charAt(0).toUpperCase() : "U"
  const isConfigRoute = location.pathname.startsWith("/app/config")
  const isDashboardRoute = location.pathname.startsWith("/app/dashboard")
  const isReportsRoute = location.pathname.startsWith("/app/reportes")
  const isAlertsRoute = location.pathname.startsWith("/app/alertas")
  const isMentionsRoute = location.pathname.startsWith("/app/mentions")

  const scrollInicioToTop = () => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    const scrollingElement = document.scrollingElement || document.documentElement
    scrollingElement?.scrollTo?.({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
        setHelpMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const mentionsFilters = useMemo(() => {
    const normalizedSources = Array.isArray(sourcesFilter)
      ? sourcesFilter.filter((source) => typeof source === "string" && source.trim().length > 0)
      : []
    const normalizedKeywords = Array.isArray(keywordsFilter)
      ? keywordsFilter.filter((kw) => typeof kw === "string" && kw !== "all" && kw.trim().length > 0)
      : []
    const normalizedTags = Array.isArray(tagsFilter)
      ? tagsFilter.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
      : []
    const normalizedAiTags = Array.isArray(aiTagsFilter)
      ? aiTagsFilter.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
      : []
    const normalizedSentiment = Array.isArray(sentimentFilter)
      ? sentimentFilter
          .map((s) => (typeof s === "string" ? s.trim().toLowerCase() : null))
          .filter((s) => s && s.length > 0)
      : []
    const normalizeMetricValue = (value) => {
      if (value === "" || value === null || value === undefined) return null
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : null
    }
    const metricKeys = ["likes", "views", "comments", "retweets", "replies", "quotes"]
    const normalizedMetrics = metricKeys.reduce((acc, key) => {
      const range = metricsFilter?.[key] || {}
      const min = normalizeMetricValue(range.min)
      const max = normalizeMetricValue(range.max)
      acc[key] = { min, max }
      return acc
    }, {})

    return {
      search: typeof search === "string" ? search.trim() : "",
      sources: normalizedSources,
      keywords: normalizedKeywords,
      tags: normalizedTags,
      aiTags: normalizedAiTags,
      sentiment: normalizedSentiment,
      metrics: normalizedMetrics,
    }
  }, [search, sourcesFilter, keywordsFilter, tagsFilter, aiTagsFilter, sentimentFilter, metricsFilter])

  const getQualitativeTags = (mention) =>
    normalizeQualitativeTags(mention).map((tag) => tag.trim())

  // All your existing filtering and processing logic remains the same
  const filteredMentions = mentions.filter((m) => {
    const matchesSearch =
      m.mention?.toLowerCase?.().includes(search.toLowerCase()) || m.source?.toLowerCase?.().includes(search.toLowerCase())

    const matchesSource = sourcesFilter.length === 0 || sourcesFilter.includes(m.platform?.toLowerCase())

    const matchesKeyword = keywordsFilter.includes("all") || keywordsFilter.includes(m.keyword)
    const mentionTags = getQualitativeTags(m)
    const matchesTag = tagsFilter.length === 0 || tagsFilter.some((t) => mentionTags.includes(t))
    const matchesAiTag =
      aiTagsFilter.length === 0 ||
      (m.ai_classification_tags || []).some((t) => aiTagsFilter.includes(t))
    const mentionSentiment = typeof m.ai_sentiment === "string" ? m.ai_sentiment.trim().toLowerCase() : null
    const matchesSentiment =
      sentimentFilter.length === 0 || (mentionSentiment && sentimentFilter.includes(mentionSentiment))
    return (
      matchesSearch &&
      matchesSource &&
      matchesKeyword &&
      matchesTag &&
      matchesAiTag &&
      matchesSentiment
    )
  })

  const sortedMentions = [...filteredMentions].sort((a, b) => {
    if (order === "recent") {
      const dateA = typeof a.created_at === "string" ? parseISO(a.created_at) : new Date(a.created_at)
      const dateB = typeof b.created_at === "string" ? parseISO(b.created_at) : new Date(b.created_at)
      return dateB.getTime() - dateA.getTime()
    }
    if (order === "popular") {
      const popularityA = Number(a.popularity_score) || 0
      const popularityB = Number(b.popularity_score) || 0
      return popularityB - popularityA
    }

    return 0
  })

  const visibleMentions = sortedMentions.filter((m) => !hiddenMentions.includes(m.url))
  const homeMentions = onlyFavorites
    ? visibleMentions.filter(
        (m) => m.is_highlighted === true || m.is_highlighted === "true",
      )
    : visibleMentions

  const toggleHighlight = async (mention) => {
    const currentHighlight =
      mention.is_highlighted === true || mention.is_highlighted === "true"
    const newValue = !currentHighlight
    try {
      const { error } = await supabase
        .from("fact_mentions")
        .update({ is_highlighted: !!newValue })
        .eq("content_id", mention.content_id)
      if (error) throw error
      setMentions((prev) =>
        prev.map((m) =>
          m.content_id === mention.content_id ? { ...m, is_highlighted: newValue } : m
        )
      )
    } catch (err) {
      console.error("Error updating mention highlight", err)
    }
  }

  const PAGE_SIZE = 20

  const sanitizeSearch = (value = "") =>
    value
      .trim()
      .replace(/[%_]/g, "\\$&")
      .replace(/,/g, "\\,")
      .replace(/'/g, "''")

  const applyMentionFilters = (
    query,
    filters = {},
    {
      skipSearch = false,
      skipSources = false,
      skipKeywords = false,
      skipTags = false,
      skipAiTags = false,
      skipSentiment = false,
    } = {},
  ) => {
    const {
      search: searchFilter = "",
      sources = [],
      keywords = [],
      tags = [],
      aiTags = [],
      sentiment = [],
      metrics = {},
    } = filters || {}

    let nextQuery = query

    if (!skipSearch && searchFilter) {
      const sanitized = sanitizeSearch(searchFilter)
      nextQuery = nextQuery.or(`mention.ilike.%${sanitized}%,source.ilike.%${sanitized}%`)
    }

    if (!skipSources && sources.length) {
      nextQuery = nextQuery.in(
        "platform",
        sources.map((s) => s?.toLowerCase?.()).filter(Boolean),
      )
    }

    if (!skipKeywords && keywords.length) {
      nextQuery = nextQuery.in(
        "keyword",
        keywords.filter((k) => typeof k === "string" && k.trim().length > 0),
      )
    }

    if (!skipTags && tags.length) {
      nextQuery = nextQuery.overlaps(
        "qualitative_tags",
        tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0),
      )
    }

    if (!skipAiTags && aiTags.length) {
      nextQuery = nextQuery.overlaps(
        "ai_classification_tags",
        aiTags.filter((t) => typeof t === "string" && t.trim().length > 0),
      )
    }

    if (!skipSentiment && sentiment.length) {
      nextQuery = nextQuery.in(
        "ai_sentiment",
        sentiment
          .map((s) => (typeof s === "string" ? s.trim().toLowerCase() : null))
          .filter((s) => s && s.length > 0),
      )
    }

    if (metrics && typeof metrics === "object") {
      Object.entries(metrics).forEach(([metricKey, range]) => {
        if (!range) return
        const min = range.min
        const max = range.max
        if (min !== null && min !== undefined) {
          nextQuery = nextQuery.gte(metricKey, min)
        }
        if (max !== null && max !== undefined) {
          nextQuery = nextQuery.lte(metricKey, max)
        }
      })
    }

    return nextQuery
  }

  const fetchMentionsPage = async (view, filters = {}, afterCursor = null, sortOrder = "recent") => {
    let query = supabase.from(view).select("*")

    if (sortOrder === "popular") {
      query = query
        .order("popularity_score", { ascending: false, nullsLast: true })
        .order("created_at", { ascending: false })
        .order("mention_id", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false }).order("mention_id", { ascending: false })
    }

    query = applyMentionFilters(query, filters)

    if (sortOrder === "popular") {
      const page = afterCursor?.page ?? 0
      query = query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)
    } else if (afterCursor) {
      const { created_at, mention_id } = afterCursor
      query = query.or(
        `created_at.lt.${created_at},and(created_at.eq.${created_at},mention_id.lt.${mention_id})`,
      )
    }

    const { data: rows, error } =
      sortOrder === "popular" ? await query : await query.limit(PAGE_SIZE)
    if (error) {
      console.error("Error fetching mentions page", error)
      return { rows: [], cursor: null, hasMore: false }
    }

    const contentIds = (rows || []).map((r) => r.content_id).filter(Boolean)

    const topCommentsById = {}
    for (let i = 0; i < contentIds.length; i += 200) {
      const chunk = contentIds.slice(i, i + 200)
      try {
        const { data: tc, error: tcErr } = await supabase
          .from("top_3_comments_vw")
          .select("content_id, comment_likes, comment")
          .in("content_id", chunk)
        if (tcErr) {
          console.error("Error fetching top_3_comments_vw", tcErr)
        } else {
          ;(tc || []).forEach((item) => {
            const k = item.content_id
            if (!k) return
            if (!topCommentsById[k]) topCommentsById[k] = []
            topCommentsById[k].push({
              comment_likes: item.comment_likes,
              comment: item.comment,
            })
          })
        }
      } catch (e) {
        console.error("Top comments fetch blew up", e)
      }
    }

    Object.keys(topCommentsById).forEach((k) => {
      topCommentsById[k] = topCommentsById[k]
        .sort((a, b) => (b.comment_likes ?? 0) - (a.comment_likes ?? 0))
        .slice(0, 3)
    })

    const enriched = (rows || []).map((r) => ({
      ...r,
      is_highlighted: r.is_highlighted === true || r.is_highlighted === "true",
      top_comments: topCommentsById[r.content_id] || [],
    }))

    const last = enriched[enriched.length - 1]
    const nextCursor =
      sortOrder === "popular"
        ? { page: (afterCursor?.page ?? 0) + 1 }
        : last
          ? { created_at: last.created_at, mention_id: last.mention_id }
          : null

    return {
      rows: enriched,
      cursor: nextCursor,
      hasMore: enriched.length === PAGE_SIZE,
    }
  }

  const loadFirstPage = async (view, filters = {}, sortOrder = "recent") => {
    setMentions([])
    setMentionsLoading(true)
    setCursor(null)
    setHasMore(true)
    setIsLoadingMore(false)
    loadedMentionIdsRef.current = new Set()

    const { rows, cursor: nextCursor, hasMore: more } = await fetchMentionsPage(
      view,
      filters,
      null,
      sortOrder,
    )

    rows.forEach((m) => loadedMentionIdsRef.current.add(m.mention_id))

    setMentions(rows)
    setCursor(nextCursor)
    setHasMore(more)
    setMentionsLoading(false)
  }

  const loadMore = async (view, filters = {}, sortOrder = "recent") => {
    if (isLoadingMore || !hasMore || !cursor) return
    setIsLoadingMore(true)
    const { rows, cursor: nextCursor, hasMore: more } = await fetchMentionsPage(
      view,
      filters,
      cursor,
      sortOrder,
    )

    const deduped = rows.filter((m) => !loadedMentionIdsRef.current.has(m.mention_id))
    deduped.forEach((m) => loadedMentionIdsRef.current.add(m.mention_id))

    setMentions((prev) => [...prev, ...deduped])
    setCursor(nextCursor)
    setHasMore(more)
    setIsLoadingMore(false)
  }

  const fetchAiTagOptions = async (view, filters = {}) => {
    try {
      let query = supabase.from(view).select("ai_classification_tags", { distinct: true })
      query = applyMentionFilters(query, filters, { skipAiTags: true })
      query = query.not("ai_classification_tags", "is", null)

      const { data, error } = await query
      if (error) throw error

      const tagSet = new Set()
      ;(data || []).forEach((row) => {
        const tags = Array.isArray(row?.ai_classification_tags)
          ? row.ai_classification_tags
          : []
        tags.forEach((tag) => {
          const normalized = typeof tag === "string" ? tag.trim() : ""
          if (normalized) {
            tagSet.add(normalized)
          }
        })
      })

      const merged = new Set([...tagSet, ...(filters.aiTags || [])])
      return Array.from(merged)
    } catch (err) {
      console.error("Error fetching AI classification tags", err)
      const merged = new Set(filters.aiTags || [])
      return Array.from(merged)
    }
  }

  const fetchSentimentOptions = async (view, filters = {}) => {
    return DEFAULT_SENTIMENT_OPTIONS
  }

  const refreshGlobalFilterOptions = async (view, filters = {}) => {
    try {
      const [aiTags, sentiments] = await Promise.all([
        fetchAiTagOptions(view, filters),
        fetchSentimentOptions(view, filters),
      ])
      setAllAiTagOptions(aiTags)
      setAllSentimentOptions(sentiments)
    } catch (err) {
      console.error("Error refreshing global filter options", err)
    }
  }

  const fetchKeywords = async () => {
    if (!accountId) {
      setKeywords([])
      return
    }

    const { data, error } = await supabase
      .from("dim_keywords")
      .select("keyword, keyword_id, created_at, active, last_processed_at_yt, last_processed_at_rd")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false })
    if (error) {
      console.error("Error fetching keywords", error)
    } else {
      setKeywords(data || [])
    }
  }

  const toggleKeywordActive = async (id, active) => {
    const { error } = await supabase.from("dim_keywords").update({ active: !!active }).eq("keyword_id", id)

    if (error) {
      console.error("Error updating keyword", error)
      return { error }
    }

    setKeywords((prev) => prev.map((k) => (k.keyword_id === id ? { ...k, active } : k)))
    return { error: null }
  }

  const deleteKeyword = async (keyword) => {
    if (!accountId) {
      return { error: new Error("No pudimos identificar tu cuenta") }
    }
    const { error } = await supabase
      .from("dim_keywords")
      .delete()
      .eq("keyword_id", keyword.keyword_id)
      .eq("account_id", accountId)

    if (error) {
      console.error("Error deleting keyword", error)
      return { error }
    }

    setKeywords((prev) => prev.filter((k) => k.keyword_id !== keyword.keyword_id))
    setKeywordChanges((prev) => {
      const next = { ...prev }
      delete next[keyword.keyword_id]
      return next
    })
    setAccountSettingsVersion((prev) => prev + 1)
    return { error: null }
  }

  const handleKeywordToggle = (id, active) => {
    setKeywords((prev) => prev.map((k) => (k.keyword_id === id ? { ...k, active } : k)))
    setKeywordChanges((prev) => ({ ...prev, [id]: active }))
  }

  const saveKeywordChanges = async () => {
    setSaveKeywordMessage(null)
    let hasError = false
    let errorMsg = ""
    for (const [id, active] of Object.entries(keywordChanges)) {
      const { error } = await toggleKeywordActive(id, active)
      if (error) {
        hasError = true
        const normalizedMessage = error.message?.includes(
          'new row violates row-level security policy for table "dim_keywords"',
        )
          ? "Se alcanzó el límite de palabras clave activas disponible en tu plan."
          : error.message
        errorMsg = normalizedMessage || "Error desconocido"
      }
    }
    setKeywordChanges({})
    if (hasError) {
      setSaveKeywordMessage({
        type: "error",
        text: `Ocurrió un error al guardar los cambios: ${errorMsg}`,
      })
      return
    }

    if (!accountId) {
      setSaveKeywordMessage({ type: "success", text: "Cambios guardados" })
      return
    }

    setAccountSettingsVersion((prev) => prev + 1)
    setSaveKeywordMessage({ type: "success", text: "Cambios guardados" })
  }

  const saveNewKeyword = async () => {
    const keywordToSave = newKeyword.trim()
    if (!keywordToSave) return
    setAddKeywordMessage(null)
    const { data: userData } = await supabase.auth.getUser()
    const { user } = userData || {}
    if (!user) {
      setAddKeywordMessage({ type: "error", text: "Debes iniciar sesión" })
      return
    }
    if (!accountId) {
      setAddKeywordMessage({ type: "error", text: "No pudimos identificar tu cuenta" })
      return
    }
    const { data, error } = await supabase
      .from("dim_keywords")
      .insert({
        keyword: keywordToSave,
        account_id: accountId,
        created_at: new Date().toISOString(),
        active: false,
      })
      .select()
    if (error || !data || data.length === 0) {
      console.error("Error adding keyword", error)
      setAddKeywordMessage({
        type: "error",
        text: `No se pudo agregar la keyword: ${error?.message || "Error desconocido"}`,
      })
    } else {
      const [insertedKeyword] = data

      setKeywords((k) => [insertedKeyword, ...k])
      setNewKeyword("")

      setAccountSettingsVersion((prev) => prev + 1)
      setAddKeywordMessage({ type: "success", text: "Keyword agregada" })
    }
  }

  useEffect(() => {
    if (accountId === undefined) {
      return
    }
    fetchKeywords()
  }, [accountId])

  useEffect(() => {
    const view = onlyFavorites ? "total_mentions_highlighted_vw" : "mentions_display_vw"
    loadFirstPage(view, mentionsFilters, order)
    refreshGlobalFilterOptions(view, mentionsFilters)
  }, [onlyFavorites, mentionsFilters, order])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoadingMore
      ) {
        const view =
          onlyFavorites
            ? "total_mentions_highlighted_vw"
            : "mentions_display_vw"
        loadMore(view, mentionsFilters, order)
      }
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onlyFavorites, mentions, mentionsFilters, order])

  const fetchSavedReports = async () => {
    if (!accountId) return
    const { data, error } = await supabase
      .from("user_reports_parameters")
      .select("*")
      .eq("account_id", accountId)
    if (error) {
      console.error("Error fetching reports", error)
      return
    }
    const mapped = (data || []).map((r) => {
      const isAiPowered = Boolean(r.is_ai_powered)
      const keywordLabel = isAiPowered
        ? "Todas"
        : r.keyword_id === "all" || r.keyword_id === null
          ? "Todas"
          : keywords.find((k) => k.keyword_id === r.keyword_id)?.keyword || ""
      return {
        id: r.id,
        name: r.name,
        platform: isAiPowered ? "all" : r.platform,
        keyword: keywordLabel,
        keywordValue: keywordLabel === "Todas" ? "all" : keywordLabel,
        startDate: r.isdynamicdate ? "" : r.date_from,
        endDate: r.isdynamicdate ? "" : r.date_to,
        datePreset: r.isdynamicdate ? (r.last_x_days ? String(r.last_x_days) : "") : "",
        isScheduled: isAiPowered ? r.is_scheduled : false,
        schedule: isAiPowered ? r.schedule : null,
        scheduleDay: isAiPowered ? r.schedule_day : null,
        scheduleTime: isAiPowered ? r.schedule_time : null,
        emailRecipients: isAiPowered ? r.email_recipients || [] : [],
        isAiPowered,
        createdAt: r.created_at,
      }
    })
    setSavedReports(sortReports(mapped))
  }

  useEffect(() => {
    if (keywords.length && accountId) {
      fetchSavedReports()
    }
  }, [keywords, accountId])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (onLogout) onLogout()
    navigate("/login")
  }

  const toggleSourceFilter = (id) => {
    const nextSources = sourcesFilter.includes(id)
      ? sourcesFilter.filter((s) => s !== id)
      : [...sourcesFilter, id]

    setSourcesFilter(nextSources)
  }

  const toggleTagFilter = (id) => {
    const nextTags = tagsFilter.includes(id)
      ? tagsFilter.filter((t) => t !== id)
      : [...tagsFilter, id]

    setTagsFilter(nextTags)
  }

  const toggleAiTagFilter = (tag) => {
    const nextAiTags = aiTagsFilter.includes(tag)
      ? aiTagsFilter.filter((t) => t !== tag)
      : [...aiTagsFilter, tag]

    setAiTagsFilter(nextAiTags)
  }

  const toggleSentimentFilter = (sentiment) => {
    const nextSentiments = sentimentFilter.includes(sentiment)
      ? sentimentFilter.filter((s) => s !== sentiment)
      : [...sentimentFilter, sentiment]

    setSentimentFilter(nextSentiments)
  }

  const clearSidebarFilters = () => {
    setSourcesFilter([])
    setSearch("")
    setKeywordsFilter(["all"])
    setTagsFilter([])
    setAiTagsFilter([])
    setSentimentFilter([])
    setMetricsFilter(createEmptyMetricsFilter())
  }

  const formatScheduleTimeValue = (timeValue, timezoneValue) => {
    if (!timeValue) return null
    const tzValue = timezoneValue?.startsWith("+") || timezoneValue?.startsWith("-")
      ? timezoneValue
      : `+${timezoneValue}`
    return `${timeValue.length === 5 ? `${timeValue}:00` : timeValue}${tzValue}`
  }

  const sortReports = (reports) => {
    return [...reports].sort((a, b) => {
      const aPinned = a.isAiPowered && a.isScheduled
      const bPinned = b.isAiPowered && b.isScheduled
      if (aPinned === bPinned) return 0
      return aPinned ? -1 : 1
    })
  }

  const EMAIL_RECIPIENT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

  const commitReportEmailRecipients = (rawValue = reportEmailRecipientInput) => {
    const candidates = rawValue
      .split(/[,\n]+/)
      .map((value) => value.trim())
      .filter(Boolean)
    if (candidates.length === 0) return
    const invalidRecipients = candidates.filter((value) => !EMAIL_RECIPIENT_REGEX.test(value))
    const validRecipients = candidates.filter((value) => EMAIL_RECIPIENT_REGEX.test(value))
    if (validRecipients.length > 0) {
      setReportEmailRecipients((prev) => {
        const existing = new Set(prev.map((email) => email.toLowerCase()))
        const next = [...prev]
        validRecipients.forEach((email) => {
          const normalized = email.toLowerCase()
          if (!existing.has(normalized)) {
            existing.add(normalized)
            next.push(email)
          }
        })
        return next
      })
    }
    if (invalidRecipients.length === 0) {
      setReportEmailRecipientInput("")
    }
  }

  const removeReportEmailRecipient = (email) => {
    setReportEmailRecipients((prev) => prev.filter((item) => item !== email))
  }

  const resetReportForm = () => {
    setNewReportName("")
    setReportPlatform("")
    setReportKeyword("")
    setReportStartDate("")
    setReportEndDate("")
    setReportDateOption("range")
    setReportEmailRecipients([])
    setReportEmailRecipientInput("")
    setReportFormType("standard")
    setShowReportForm(false)
    setShowReportTypeSelector(false)
    setEditingReportId(null)
  }

  const handleEditReport = (report) => {
    if (!report) return
    setReportMessage(null)
    setEditingReportId(report.id)
    setShowReportForm(true)
    setReportFormType(report.isAiPowered ? "ai" : "standard")
    setNewReportName(report.name || "")
    setReportPlatform(report.platform || "")
    setReportKeyword(report.keywordValue || (report.keyword === "Todas" ? "all" : report.keyword) || "")
    if (report.datePreset) {
      setReportDateOption(report.datePreset)
      setReportStartDate("")
      setReportEndDate("")
    } else {
      setReportDateOption("range")
      setReportStartDate(report.startDate || "")
      setReportEndDate(report.endDate || "")
    }
    setReportEmailRecipients(report.isAiPowered && Array.isArray(report.emailRecipients) ? report.emailRecipients : [])
    setReportEmailRecipientInput("")
  }

  const handleCreateReport = async () => {
    setReportMessage(null)
    const { data: userData } = await supabase.auth.getUser()
    const { user } = userData || {}
    if (!user) return
    if (!accountId) {
      console.error("Missing account ID for current user")
      setReportMessage({ type: "error", text: "No pudimos identificar tu cuenta." })
      return
    }
    const keywordObj = keywords.find((k) => k.keyword === reportKeyword)
    const isAiReport = reportFormType === "ai"
    const isDynamic = isAiReport ? true : reportDateOption !== "range"
    const aiSchedulePayload = isAiReport
      ? {
          is_scheduled: true,
          schedule: AI_REPORT_SCHEDULE,
          schedule_day: AI_REPORT_SCHEDULE_DAY,
          schedule_time: formatScheduleTimeValue(AI_REPORT_SCHEDULE_TIME, DEFAULT_REPORT_TIMEZONE),
          email_recipients: reportEmailRecipients,
        }
      : {}
    const insertData = {
      name: isAiReport ? AI_REPORT_NAME : newReportName || `Reporte ${savedReports.length + 1}`,
      platform: isAiReport ? "all" : reportPlatform,
      keyword_id: isAiReport ? null : reportKeyword === "all" ? null : keywordObj?.keyword_id || null,
      isdynamicdate: isDynamic,
      date_from: isAiReport ? null : isDynamic ? null : reportStartDate || null,
      date_to: isAiReport ? null : isDynamic ? null : reportEndDate || null,
      last_x_days: isDynamic ? Number(isAiReport ? AI_REPORT_DATE_PRESET : reportDateOption) : null,
      user_id: user.id,
      account_id: accountId,
      is_ai_powered: isAiReport,
      ...aiSchedulePayload,
    }
    const { data, error } = await supabase
      .from("user_reports_parameters")
      .insert(insertData)
      .select()
    if (error) {
      console.error("Error creating report", error)
      const normalizedMessage = error.message?.includes(
        'duplicate key value violates unique constraint "one_ai_report_per_account"'
      )
        ? "Solo se permite un reporte generado por IA por cuenta."
        : error.message || "Ocurrió un error al crear el reporte."
      setReportMessage({ type: "error", text: normalizedMessage })
    } else if (data && data.length > 0) {
      const r = data[0]
      const isAiPowered = Boolean(r.is_ai_powered)
      const keywordLabel = isAiPowered
        ? "Todas"
        : r.keyword_id === "all" || r.keyword_id === null
          ? "Todas"
          : keywords.find((k) => k.keyword_id === r.keyword_id)?.keyword || ""
      const newRep = {
        id: r.id,
        name: r.name,
        platform: isAiPowered ? "all" : r.platform,
        keyword: keywordLabel,
        keywordValue: keywordLabel === "Todas" ? "all" : keywordLabel,
        startDate: r.isdynamicdate ? "" : r.date_from,
        endDate: r.isdynamicdate ? "" : r.date_to,
        datePreset: r.isdynamicdate ? (r.last_x_days ? String(r.last_x_days) : "") : "",
        isScheduled: isAiPowered ? r.is_scheduled : false,
        schedule: isAiPowered ? r.schedule : null,
        scheduleDay: isAiPowered ? r.schedule_day : null,
        scheduleTime: isAiPowered ? r.schedule_time : null,
        emailRecipients: isAiPowered ? r.email_recipients || [] : [],
        isAiPowered,
        createdAt: r.created_at,
      }
      setSavedReports((prev) => sortReports([...prev, newRep]))
      resetReportForm()
      setReportMessage(null)
    }
  }

  const handleUpdateReport = async () => {
    if (!editingReportId) return
    setReportMessage(null)
    const keywordObj = keywords.find((k) => k.keyword === reportKeyword)
    const isAiReport = reportFormType === "ai"
    const isDynamic = isAiReport ? true : reportDateOption !== "range"
    const aiSchedulePayload = isAiReport
      ? {
          is_scheduled: true,
          schedule: AI_REPORT_SCHEDULE,
          schedule_day: AI_REPORT_SCHEDULE_DAY,
          schedule_time: formatScheduleTimeValue(AI_REPORT_SCHEDULE_TIME, DEFAULT_REPORT_TIMEZONE),
          email_recipients: reportEmailRecipients,
        }
      : {}
    const updateData = {
      name: isAiReport ? AI_REPORT_NAME : newReportName || "Reporte",
      platform: isAiReport ? "all" : reportPlatform,
      keyword_id: isAiReport ? null : reportKeyword === "all" ? null : keywordObj?.keyword_id || null,
      isdynamicdate: isDynamic,
      date_from: isAiReport ? null : isDynamic ? null : reportStartDate || null,
      date_to: isAiReport ? null : isDynamic ? null : reportEndDate || null,
      last_x_days: isDynamic ? Number(isAiReport ? AI_REPORT_DATE_PRESET : reportDateOption) : null,
      is_ai_powered: isAiReport,
      ...aiSchedulePayload,
    }
    const { data, error } = await supabase
      .from("user_reports_parameters")
      .update(updateData)
      .eq("id", editingReportId)
      .select()
    if (error) {
      console.error("Error updating report", error)
      setReportMessage({ type: "error", text: error.message || "Ocurrió un error al actualizar el reporte." })
      return
    }
    const updated = data?.[0]
    if (!updated) return
    const updatedIsAi = Boolean(updated.is_ai_powered)
    const updatedKeywordLabel = updatedIsAi
      ? "Todas"
      : updated.keyword_id === "all" || updated.keyword_id === null
        ? "Todas"
        : keywords.find((k) => k.keyword_id === updated.keyword_id)?.keyword || ""
    setSavedReports((prev) =>
      sortReports(
        prev.map((rep) =>
          rep.id === editingReportId
            ? {
                ...rep,
                name: updated.name,
                platform: updatedIsAi ? "all" : updated.platform,
                keyword: updatedKeywordLabel,
                keywordValue: updatedKeywordLabel === "Todas" ? "all" : updatedKeywordLabel,
                startDate: updated.isdynamicdate ? "" : updated.date_from,
                endDate: updated.isdynamicdate ? "" : updated.date_to,
                datePreset: updated.isdynamicdate ? (updated.last_x_days ? String(updated.last_x_days) : "") : "",
                isScheduled: updatedIsAi ? updated.is_scheduled : false,
                schedule: updatedIsAi ? updated.schedule : null,
                scheduleDay: updatedIsAi ? updated.schedule_day : null,
                scheduleTime: updatedIsAi ? updated.schedule_time : null,
                emailRecipients: updatedIsAi ? updated.email_recipients || [] : [],
                isAiPowered: updatedIsAi,
              }
            : rep
        )
      )
    )
    resetReportForm()
    setReportMessage(null)
  }

  const handleDownloadReport = async (rep) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Debes iniciar sesión para descargar el reporte.");
        return;
      }
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export_reports_to_csv`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ report_id: rep.id }),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const disp = res.headers.get("Content-Disposition") || "";
      const match = /filename="?([^"]+)"?/.exec(disp);
      const fallbackName = `${(rep.name || "reporte").replace(/[^\w.-]+/g, "_").slice(0, 60)}.csv`;
      const filename = match?.[1] || fallbackName;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert(`Error al descargar: ${e?.message || e}`);
    }
  }

  const handleDeleteReport = async (index) => {
    const rep = savedReports[index]
    if (!rep) return
    const { error } = await supabase
      .from("user_reports_parameters")
      .delete()
      .eq("id", rep.id)
    if (error) {
      console.error("Error deleting report", error)
      return
    }
    setSavedReports((prev) => prev.filter((_, i) => i !== index))
  }

  const activeKeywords = useMemo(() => keywords.filter((k) => k.active), [keywords])

  const handleNavigation = () => {
    setIsSidebarOpen(false)
    setMenuOpen(false)
    setHelpMenuOpen(false)
  }

  const handleLogoClick = () => {
    handleNavigation()
    if (isMentionsRoute) {
      scrollInicioToTop()
    } else {
      navigate("/app/mentions")
    }
  }

  const handleMentionsNavigation = () => {
    handleNavigation()
    if (location.pathname !== "/app/mentions") {
      navigate("/app/mentions")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700/50 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60 transition"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <img
                  src={logo}
                  alt="Listening Lab"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Listening Lab
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <NotificationsMenu />

            <div className="relative" ref={helpMenuRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setHelpMenuOpen(!helpMenuOpen)
                  setMenuOpen(false)
                }}
                className="text-slate-300 hover:text-white"
              >
                <CircleHelp className="w-4 h-4" />
              </Button>
              {helpMenuOpen && (
                <div className="absolute right-0 top-12 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-lg p-2 space-y-1 z-50 min-w-[210px]">
                  <button
                    onClick={() => {
                      setHelpMenuOpen(false)
                      navigate("/app/support")
                    }}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors whitespace-nowrap"
                  >
                    <Headset className="w-4 h-4" />
                    Solicitar soporte
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                onClick={() => {
                  setMenuOpen(!menuOpen)
                  setHelpMenuOpen(false)
                }}
                className="flex items-center gap-2 text-slate-300 hover:text-white"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src="/placeholder.svg?height=28&width=28" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    {avatarLabel}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" />
              </Button>

              {menuOpen && (
                <div className="absolute right-0 top-12 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-lg p-2 space-y-1 z-50 min-w-[180px]">
                  <button
                    onClick={() => {
                      navigate("/account/profile")
                      setMenuOpen(false)
                    }}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                  >
                    <CircleUser className="w-4 h-4" />
                    Mi Cuenta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Modern Sidebar */}
        <aside className="hidden md:flex lg:flex lg:w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 p-6 flex-col space-y-2 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          <SidebarNavigation
            onMentionsNavigate={handleMentionsNavigation}
            onNavigate={handleNavigation}
            isAdmin={isAdmin}
          />
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative ml-0 flex h-full">
              <div
                className="relative h-full w-72 max-w-[80vw] bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 p-6 flex flex-col space-y-2 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <SidebarNavigation
                  onMentionsNavigate={handleMentionsNavigation}
                  onNavigate={handleNavigation}
                  isAdmin={isAdmin}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main ref={mainContentRef} className="w-full lg:flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="config"
              element={
                isAdmin ? (
                  <ConfigPage
                    newKeyword={newKeyword}
                    setNewKeyword={setNewKeyword}
                    saveNewKeyword={saveNewKeyword}
                    addKeywordMessage={addKeywordMessage}
                    keywords={keywords}
                    handleKeywordToggle={handleKeywordToggle}
                    handleKeywordDelete={deleteKeyword}
                    saveKeywordChanges={saveKeywordChanges}
                    keywordChanges={keywordChanges}
                    saveKeywordMessage={saveKeywordMessage}
                    accountId={accountId}
                    accountSettingsVersion={accountSettingsVersion}
                  />
                ) : (
                  <Navigate to="mentions" replace />
                )
              }
            />
            <Route
              path="dashboard"
              element={
                <DashboardPage embedded />
              }
            />
            <Route
              path="reportes"
              element={
                <ReportsPage
                  savedReports={savedReports}
                  onDownload={handleDownloadReport}
                  onDelete={handleDeleteReport}
                  onEdit={handleEditReport}
                  showReportForm={showReportForm}
                  showReportTypeSelector={showReportTypeSelector}
                  reportFormType={reportFormType}
                  onToggleReportForm={() => {
                    if (editingReportId) {
                      resetReportForm()
                      return
                    }
                    if (showReportForm) {
                      setShowReportForm(false)
                      setShowReportTypeSelector(false)
                      return
                    }
                    setShowReportTypeSelector((prev) => !prev)
                  }}
                  onReportTypeSelect={(type) => {
                    setReportFormType(type)
                    setShowReportTypeSelector(false)
                    setShowReportForm(true)
                    setReportDateOption(type === "ai" ? AI_REPORT_DATE_PRESET : "range")
                  }}
                  newReportName={newReportName}
                  onReportNameChange={setNewReportName}
                  reportPlatform={reportPlatform}
                  onReportPlatformChange={setReportPlatform}
                  reportKeyword={reportKeyword}
                  onReportKeywordChange={setReportKeyword}
                  reportDateOption={reportDateOption}
                  onReportDateOptionChange={setReportDateOption}
                  reportStartDate={reportStartDate}
                  onReportStartDateChange={setReportStartDate}
                  reportEndDate={reportEndDate}
                  onReportEndDateChange={setReportEndDate}
                  activeKeywords={activeKeywords}
                  reportEmailRecipients={reportEmailRecipients}
                  reportEmailRecipientInput={reportEmailRecipientInput}
                  onReportEmailRecipientInputChange={setReportEmailRecipientInput}
                  onReportEmailRecipientsCommit={commitReportEmailRecipients}
                  onRemoveReportEmailRecipient={removeReportEmailRecipient}
                  onCreateReport={editingReportId ? handleUpdateReport : handleCreateReport}
                  reportMessage={reportMessage}
                  isEditingReport={Boolean(editingReportId)}
                  onCancelEdit={resetReportForm}
                />
              }
            />
            <Route path="alertas" element={<AlertsPage />} />
            <Route path="*" element={<Navigate to="mentions" replace />} />
          </Routes>
          {!isConfigRoute && !isDashboardRoute && !isReportsRoute && !isAlertsRoute && (
            <section className="p-8">
              <div className="flex items-start gap-8 min-h-screen">
                <div className="flex-1">
                  <AISummary />
                  {/* Search Header */}
                  <div className="mb-8">
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Buscar menciones..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-11 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between mb-6">
                    <Tabs value={order} onValueChange={setOrder}>
                      <TabsList className="bg-slate-800/50 border-slate-700/50">
                        <TabsTrigger
                          value="recent"
                          className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white"
                        >
                          Más recientes
                        </TabsTrigger>
                        <TabsTrigger
                          value="popular"
                          className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-white"
                        >
                          Más populares
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <Button
                      onClick={() => setOnlyFavorites(!onlyFavorites)}
                      variant={onlyFavorites ? "default" : "outline"}
                      className={cn(
                        "flex items-center gap-2",
                        onlyFavorites
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          : "border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50",
                      )}
                    >
                      <Star className="w-4 h-4" />
                      Destacados
                    </Button>
                  </div>

                  {/* Mentions Feed */}
                  <div className="space-y-4">
                    {mentionsLoading ? (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
          >
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ))}
      </div>
    ) : homeMentions.length ? (
                      <>
                        {homeMentions.map((m) => (
                          <div
                            key={m.mention_id}
                            className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-200"
                          >
                            <MentionCard
                              mention={m}
                              source={m.platform}
                              username={m.source}
                              timestamp={formatDistanceToNow(new Date(m.created_at), {
                                addSuffix: true,
                                locale: es,
                              })}
                              content={m.mention}
                              keyword={m.keyword}
                              url={m.url}
                              onHide={() => setHiddenMentions((prev) => [...prev, m.url])}
                              onToggleHighlight={toggleHighlight}
                              tags={getQualitativeTags(m)}
                              aiTags={m.ai_classification_tags || []}
                            />
                          </div>
                        ))}
                        {isLoadingMore && (
                          <div className="text-center py-4 text-sm text-slate-400">
                            Cargando...
                          </div>
                        )}
                        <div ref={sentinelRef} />
                      </>
                    ) : mentions.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">Estamos recolectando menciones...</p>
                        <p className="text-slate-500 text-sm">Aparecerán aquí en breve.</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No se han encontrado menciones</p>
                        <p className="text-slate-500 text-sm">Intenta ajustar tus filtros o palabras clave</p>
                      </div>
                    )}
                  </div>
                </div>

                <RightSidebar
                  className="mt-0 ml-auto"
                  sources={sourcesFilter}
                  toggleSource={toggleSourceFilter}
                  keywords={keywordsFilter}
                  setKeywords={setKeywordsFilter}
                  keywordOptions={activeKeywords}
                  tags={tagsFilter}
                  toggleTag={toggleTagFilter}
                  aiTags={aiTagsFilter}
                  toggleAiTag={toggleAiTagFilter}
                  aiTagOptions={allAiTagOptions}
                  sentiments={sentimentFilter}
                  toggleSentiment={toggleSentimentFilter}
                  sentimentOptions={allSentimentOptions}
                  metricsFilter={metricsFilter}
                  updateMetricRange={updateMetricRange}
                  clearFilters={clearSidebarFilters}
                />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

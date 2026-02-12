import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function useDashboardData({
  currentTab,
  keywords,
  allAiTagOptions,
  allSentimentOptions,
}) {
  const defaultStart = new Date()
  defaultStart.setFullYear(defaultStart.getFullYear() - 1)
  const defaultStartDate = defaultStart.toISOString().slice(0, 10)
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [endDate, setEndDate] = useState("")
  const [selectedDashboardKeywords, setSelectedDashboardKeywords] = useState(["all"])
  const [selectedDashboardPlatforms, setSelectedDashboardPlatforms] = useState(["all"])
  const [selectedDashboardSentiments, setSelectedDashboardSentiments] = useState([])
  const [selectedDashboardAiTags, setSelectedDashboardAiTags] = useState([])
  const [dashLoading, setDashLoading] = useState(false)
  const [kpiTotal, setKpiTotal] = useState(0)
  const [kpiMoM, setKpiMoM] = useState({ curr_cnt: 0, prev_cnt: 0, pct_change: 0 })
  const [series, setSeries] = useState([])
  const [topWords, setTopWords] = useState([])
  const [sourceTop, setSourceTop] = useState([])
  const [tagCounts, setTagCounts] = useState([])

  const dashboardSentimentOptions = useMemo(
    () =>
      (allSentimentOptions || []).map((sentiment) => {
        const normalized = typeof sentiment === "string" ? sentiment : String(sentiment ?? "")
        const label = normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : normalized
        return { value: normalized, label }
      }),
    [allSentimentOptions],
  )

  const dashboardAiTagOptions = useMemo(
    () =>
      (allAiTagOptions || []).map((tag) => {
        const normalized = typeof tag === "string" ? tag : String(tag ?? "")
        return { value: normalized, label: normalized }
      }),
    [allAiTagOptions],
  )

  const clearDashboardFilters = useCallback(() => {
    setSelectedDashboardKeywords(["all"])
    setSelectedDashboardPlatforms(["all"])
    setSelectedDashboardSentiments([])
    setSelectedDashboardAiTags([])
    setStartDate(defaultStartDate)
    setEndDate("")
  }, [defaultStartDate])

  const buildDashboardParams = useCallback(() => {
    const from = startDate ? new Date(startDate).toISOString() : null
    let to = null
    if (endDate) {
      const d = new Date(endDate)
      d.setHours(23, 59, 59, 999)
      to = d.toISOString()
    }
    const platforms = selectedDashboardPlatforms.includes("all")
      ? null
      : selectedDashboardPlatforms.map((p) => p.toLowerCase())
    const keywordIds = selectedDashboardKeywords.includes("all")
      ? null
      : selectedDashboardKeywords
          .map((kw) => keywords.find((k) => k.keyword === kw)?.keyword_id)
          .filter((id) => typeof id === "string")

    const sentimentList = selectedDashboardSentiments
      .map((s) => (typeof s === "string" ? s.trim().toLowerCase() : ""))
      .filter((s) => s.length > 0)
    const sentiments = sentimentList.length ? sentimentList : null

    const aiTagList = selectedDashboardAiTags
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter((tag) => tag.length > 0)
    const aiTags = aiTagList.length ? aiTagList : null

    return { from, to, platforms, keywordIds, sentiments, aiTags }
  }, [
    endDate,
    keywords,
    selectedDashboardAiTags,
    selectedDashboardKeywords,
    selectedDashboardPlatforms,
    selectedDashboardSentiments,
    startDate,
  ])

  const fetchDashboardKpis = useCallback(async () => {
    try {
      const { from, to, platforms, keywordIds, sentiments, aiTags } = buildDashboardParams()
      const { data: totalData, error: totalError } = await supabase.rpc("rpt_mentions_total", {
        p_from: from,
        p_to: to,
        p_platforms: platforms,
        p_keywords: keywordIds,
        p_ai_sentiment: sentiments,
        p_ai_classification_tags: aiTags,
      })
      if (totalError) throw totalError
      setKpiTotal(totalData?.[0]?.total || 0)

      const toStartOfDay = (date) => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        return d
      }

      const toEndOfDay = (date) => {
        const d = new Date(date)
        d.setHours(23, 59, 59, 999)
        return d
      }

      const getStartOfWeek = (date) => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = day === 0 ? -6 : 1 - day
        d.setDate(d.getDate() + diff)
        d.setHours(0, 0, 0, 0)
        return d
      }

      let referenceDate = endDate ? new Date(endDate) : new Date()
      if (endDate) {
        referenceDate = toEndOfDay(referenceDate)
      }
      if (Number.isNaN(referenceDate?.getTime())) {
        setKpiMoM({ curr_cnt: 0, prev_cnt: 0, pct_change: 0 })
      } else {
        let currentPeriodEnd = new Date(referenceDate)
        let currentPeriodStart = getStartOfWeek(currentPeriodEnd)
        const filterStart = startDate ? toStartOfDay(new Date(startDate)) : null
        if (filterStart && !Number.isNaN(filterStart.getTime())) {
          if (filterStart > currentPeriodEnd) {
            currentPeriodStart = filterStart
            currentPeriodEnd = new Date(filterStart)
          } else if (filterStart > currentPeriodStart) {
            currentPeriodStart = filterStart
          }
        }
        currentPeriodStart = toStartOfDay(currentPeriodStart)
        if (currentPeriodEnd < currentPeriodStart) {
          currentPeriodEnd = new Date(currentPeriodStart)
        }
        const currentDuration = currentPeriodEnd.getTime() - currentPeriodStart.getTime()
        const previousPeriodStart = new Date(currentPeriodStart)
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7)
        const previousPeriodEnd = new Date(previousPeriodStart.getTime() + currentDuration)

        const { data: currentWeekData, error: currentWeekError } = await supabase.rpc(
          "rpt_mentions_total",
          {
            p_from: currentPeriodStart.toISOString(),
            p_to: currentPeriodEnd.toISOString(),
            p_platforms: platforms,
            p_keywords: keywordIds,
          },
        )
        if (currentWeekError) throw currentWeekError

        const { data: previousWeekData, error: previousWeekError } = await supabase.rpc(
          "rpt_mentions_total",
          {
            p_from: previousPeriodStart.toISOString(),
            p_to: previousPeriodEnd.toISOString(),
            p_platforms: platforms,
            p_keywords: keywordIds,
            p_ai_sentiment: sentiments,
            p_ai_classification_tags: aiTags,
          },
        )
        if (previousWeekError) throw previousWeekError

        const curr_cnt = Number(currentWeekData?.[0]?.total) || 0
        const prev_cnt = Number(previousWeekData?.[0]?.total) || 0
        const pct_change = prev_cnt === 0 ? (curr_cnt === 0 ? 0 : 100) : ((curr_cnt - prev_cnt) / prev_cnt) * 100

        setKpiMoM({ curr_cnt, prev_cnt, pct_change })
      }
    } catch (err) {
      console.error("Error fetching dashboard KPIs", err)
    }
  }, [buildDashboardParams, endDate, startDate])

  const fetchTopWords = useCallback(async () => {
    try {
      const { from, to, platforms, keywordIds, sentiments, aiTags } = buildDashboardParams()
      const { data, error } = await supabase.rpc("rpt_top_words", {
        p_from: from,
        p_to: to,
        p_platforms: platforms,
        p_keywords: keywordIds,
        p_min_len: 3,
        p_limit: 30,
        p_ai_sentiment: sentiments,
        p_ai_classification_tags: aiTags,
      })
      if (error) throw error

      setTopWords((data || []).map((item) => ({ text: item.word, value: Number(item.cnt) })))
    } catch (err) {
      console.error("Error fetching top words", err)
    }
  }, [buildDashboardParams])

  const fetchTopSources = useCallback(async () => {
    try {
      const { from, to, platforms, keywordIds, sentiments, aiTags } = buildDashboardParams()
      const { data, error } = await supabase.rpc("rpt_mentions_by_source", {
        p_from: from,
        p_to: to,
        p_sources: platforms,
        p_keywords: keywordIds,
        p_limit: 10,
        p_ai_sentiment: sentiments,
        p_ai_classification_tags: aiTags,
      })
      if (error) throw error
      setSourceTop(
        (data || []).map((item) => ({
          source: item.source,
          platform: item.platform,
          count: Number(item.cnt),
        })),
      )
    } catch (err) {
      console.error("Error fetching top sources", err)
    }
  }, [buildDashboardParams])

  const fetchTagMentions = useCallback(async () => {
    try {
      const { from, to, platforms, keywordIds, sentiments, aiTags } = buildDashboardParams()
      const { data, error } = await supabase.rpc("rpt_mentions_by_tag", {
        p_from: from,
        p_to: to,
        p_sources: platforms,
        p_keywords: keywordIds,
        p_ai_sentiment: sentiments,
        p_ai_classification_tags: aiTags,
        p_limit: 20,
      })
      if (error) throw error
      setTagCounts((data || []).map((item) => ({ tag: item.tag, count: Number(item.cnt) })))
    } catch (err) {
      console.error("Error fetching mentions by tag", err)
    }
  }, [buildDashboardParams])

  const fetchSeries = useCallback(async () => {
    try {
      const { from, to, platforms, keywordIds, sentiments, aiTags } = buildDashboardParams()
      let p_bucket = "day"
      if (startDate && endDate) {
        const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        if (diff > 180) p_bucket = "month"
        else if (diff > 60) p_bucket = "week"
      }
      const { data, error } = await supabase.rpc("rpt_mentions_over_time", {
        p_from: from,
        p_to: to,
        p_platforms: platforms,
        p_keywords: keywordIds,
        p_bucket,
        p_ai_sentiment: sentiments,
        p_ai_classification_tags: aiTags,
      })
      if (error) throw error
      setSeries((data || []).map((item) => ({ date: item.ts, count: Number(item.cnt) })))
    } catch (err) {
      console.error("Error fetching mentions over time", err)
    }
  }, [buildDashboardParams, endDate, startDate])

  useEffect(() => {
    if (currentTab !== "dashboard") return

    let isSubscribed = true

    const loadDashboardData = async () => {
      setDashLoading(true)
      try {
        await Promise.all([
          fetchDashboardKpis(),
          fetchTopWords(),
          fetchTopSources(),
          fetchTagMentions(),
          fetchSeries(),
        ])
      } finally {
        if (isSubscribed) {
          setDashLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isSubscribed = false
    }
  }, [
    currentTab,
    fetchDashboardKpis,
    fetchTopWords,
    fetchTopSources,
    fetchTagMentions,
    fetchSeries,
  ])

  const sentimentKpiFilters = useMemo(() => {
    const { from, to, platforms, keywordIds, aiTags } = buildDashboardParams()
    return {
      p_from: from,
      p_to: to,
      p_platforms: platforms,
      p_keywords: keywordIds,
      p_ai_classification_tags: aiTags,
    }
  }, [buildDashboardParams])

  const kpiMoMDisplay = useMemo(() => {
    const pct = kpiMoM.pct_change
    if (pct == null) return "—%"
    const value = Math.abs(pct) >= 1 ? pct.toFixed(0) : pct.toFixed(2)
    return `${pct >= 0 ? "+" : ""}${parseFloat(value)}%`
  }, [kpiMoM])

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    selectedDashboardKeywords,
    setSelectedDashboardKeywords,
    selectedDashboardPlatforms,
    setSelectedDashboardPlatforms,
    selectedDashboardSentiments,
    setSelectedDashboardSentiments,
    selectedDashboardAiTags,
    setSelectedDashboardAiTags,
    dashboardSentimentOptions,
    dashboardAiTagOptions,
    dashLoading,
    kpiTotal,
    kpiMoMDisplay,
    sentimentKpiFilters,
    series,
    topWords,
    sourceTop,
    tagCounts,
    clearDashboardFilters,
  }
}

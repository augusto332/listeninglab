import { useEffect, useMemo, useState } from "react"
import DashboardSection from "./components/DashboardSection"
import useDashboardData from "./hooks/useDashboardData"
import { supabase } from "./lib/supabaseClient"
import { useAuth } from "./context/AuthContext"

export default function DashboardPage({ embedded = false }) {
  const { accountId } = useAuth()
  const [keywords, setKeywords] = useState([])
  const [allAiTagOptions, setAllAiTagOptions] = useState([])
  const [allSentimentOptions, setAllSentimentOptions] = useState([])

  const activeKeywords = useMemo(() => keywords.filter((k) => k.active), [keywords])

  const {
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
    clearDashboardFilters,
    dashLoading,
    kpiTotal,
    kpiMoMDisplay,
    sentimentKpiFilters,
    topWords,
    tagCounts,
    sourceTop,
    series,
  } = useDashboardData({ currentTab: "dashboard", keywords, allAiTagOptions, allSentimentOptions })

  useEffect(() => {
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

    const fetchAiTagOptions = async () => {
      try {
        const { data, error } = await supabase
          .from("mentions_display_vw")
          .select("ai_classification_tags", { distinct: true })
          .not("ai_classification_tags", "is", null)

        if (error) throw error

        const options = Array.from(
          new Set(
            (data || []).flatMap((row) =>
              Array.isArray(row.ai_classification_tags)
                ? row.ai_classification_tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0)
                : [],
            ),
          ),
        )
        setAllAiTagOptions(options)
      } catch (err) {
        console.error("Error fetching AI tag options", err)
      }
    }

    const fetchSentimentOptions = async () => {
      try {
        const { data, error } = await supabase
          .from("mentions_display_vw")
          .select("ai_sentiment", { distinct: true })
          .not("ai_sentiment", "is", null)

        if (error) throw error

        const normalized = Array.from(
          new Set(
            (data || [])
              .map((row) => (typeof row?.ai_sentiment === "string" ? row.ai_sentiment.trim().toLowerCase() : ""))
              .filter((value) => value.length > 0),
          ),
        )

        setAllSentimentOptions(normalized)
      } catch (err) {
        console.error("Error fetching sentiment options", err)
      }
    }

    fetchKeywords()
    fetchAiTagOptions()
    fetchSentimentOptions()
  }, [accountId])

  const content = (
    <DashboardSection
      activeKeywords={activeKeywords}
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      selectedDashboardKeywords={selectedDashboardKeywords}
      setSelectedDashboardKeywords={setSelectedDashboardKeywords}
      selectedDashboardPlatforms={selectedDashboardPlatforms}
      setSelectedDashboardPlatforms={setSelectedDashboardPlatforms}
      selectedDashboardSentiments={selectedDashboardSentiments}
      setSelectedDashboardSentiments={setSelectedDashboardSentiments}
      selectedDashboardAiTags={selectedDashboardAiTags}
      setSelectedDashboardAiTags={setSelectedDashboardAiTags}
      dashboardSentimentOptions={dashboardSentimentOptions}
      dashboardAiTagOptions={dashboardAiTagOptions}
      clearDashboardFilters={clearDashboardFilters}
      dashLoading={dashLoading}
      kpiTotal={kpiTotal}
      kpiMoMDisplay={kpiMoMDisplay}
      sentimentKpiFilters={sentimentKpiFilters}
      topWords={topWords}
      tagCounts={tagCounts}
      sourceTop={sourceTop}
      series={series}
    />
  )

  if (embedded) {
    return content
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">{content}</div>
  )
}

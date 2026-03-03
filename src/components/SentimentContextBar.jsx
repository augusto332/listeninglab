import { useEffect, useMemo, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { supabase } from "@/lib/supabaseClient"

const SENTIMENT_COLORS = {
  positive: "bg-green-500/70",
  negative: "bg-red-500/70",
  neutral: "bg-slate-300/70",
}

const SENTIMENT_LABELS = {
  positive: "Positivo",
  negative: "Negativo",
  neutral: "Neutral",
}

const BASE_SEGMENTS = [
  { key: "positive", pct: 0 },
  { key: "negative", pct: 0 },
  { key: "neutral", pct: 0 },
]

export default function SentimentContextBar({ filters }) {
  const [segments, setSegments] = useState(BASE_SEGMENTS)

  useEffect(() => {
    const fetchSentimentBreakdown = async () => {
      if (!filters) {
        setSegments(BASE_SEGMENTS)
        return
      }

      try {
        const { data, error } = await supabase.rpc("rpt_mentions_by_sentiment", {
          p_from: filters.p_from,
          p_to: filters.p_to,
          p_platforms: filters.p_platforms,
          p_keywords: filters.p_keywords,
          p_ai_classification_tags: filters.p_ai_classification_tags,
        })

        if (error) throw error

        const values = (data || []).reduce(
          (acc, item) => {
            const key = item.ai_sentiment?.toLowerCase()
            if (key && key in acc) {
              acc[key] = Math.max(parseFloat(item.pct) || 0, 0)
            }
            return acc
          },
          { positive: 0, negative: 0, neutral: 0 }
        )

        setSegments([
          { key: "positive", pct: values.positive },
          { key: "negative", pct: values.negative },
          { key: "neutral", pct: values.neutral },
        ])
      } catch (error) {
        console.error("Error fetching sentiment context bar:", error)
        setSegments(BASE_SEGMENTS)
      }
    }

    fetchSentimentBreakdown()
  }, [filters])

  const normalizedSegments = useMemo(() => {
    const total = segments.reduce((sum, segment) => sum + segment.pct, 0)
    if (total <= 0) {
      return BASE_SEGMENTS.map((segment) => ({ ...segment, width: segment.key === "neutral" ? 100 : 0 }))
    }

    return segments.map((segment) => ({
      ...segment,
      width: (segment.pct / total) * 100,
    }))
  }, [segments])

  return (
    <div className="mt-3" aria-label="Distribución total de sentimientos">
      <TooltipProvider>
        <div className="w-full rounded-full overflow-hidden bg-slate-700/40 flex h-4">
          {normalizedSegments.map((segment) => (
            <Tooltip key={segment.key}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="relative h-full"
                  style={{ width: `${segment.width}%` }}
                  aria-label={`${SENTIMENT_LABELS[segment.key]} ${segment.pct.toFixed(1)}%`}
                >
                  <span
                    className={`${SENTIMENT_COLORS[segment.key]} absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2`}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {SENTIMENT_LABELS[segment.key]}: {segment.pct.toFixed(1)}%
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}

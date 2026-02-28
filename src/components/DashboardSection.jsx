import { Loader2, MessageSquare, Smile, Frown } from "lucide-react"
import DatePickerInput from "@/components/DatePickerInput"
import MentionsLineChart from "@/components/MentionsLineChart"
import WordCloud from "@/components/WordCloud"
import TagMentionsBarChart from "@/components/TagMentionsBarChart"
import ActiveSourcesBarChart from "@/components/ActiveSourcesBarChart"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MultiSelect from "@/components/MultiSelect"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import SentimentKPI from "@/components/SentimentKPI"

export default function DashboardSection({
  keywords,
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
}) {
  return (
    <section className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400 mb-6">Revela tendencias y patrones de tus menciones y palabras clave</p>
      </div>

      <div className="relative z-10 flex gap-4 mb-8 p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl">
        <div className="min-w-[12rem] w-[12rem]">
          <p className="text-sm font-medium mb-2 text-slate-300">Palabras clave</p>
          <MultiSelect
            className="w-full"
            options={[
              { value: "all", label: "Todas" },
              ...keywords.map((k) => ({
                value: k.keyword,
                label: k.active ? k.keyword : `${k.keyword} (inactiva)`,
              })),
            ]}
            value={selectedDashboardKeywords}
            onChange={setSelectedDashboardKeywords}
          />
        </div>
        <div className="min-w-[12rem] w-[12rem]">
          <p className="text-sm font-medium mb-2 text-slate-300">Rango de fechas</p>
          <div className="flex flex-col gap-2">
            <DatePickerInput value={startDate} onChange={setStartDate} placeholder="Desde" className="w-full" />
            <DatePickerInput value={endDate} onChange={setEndDate} placeholder="Hasta" className="w-full" />
          </div>
        </div>
        <div className="min-w-[12rem] w-[12rem]">
          <p className="text-sm font-medium mb-2 text-slate-300">Plataformas</p>
          <MultiSelect
            className="w-full"
            options={[
              { value: "all", label: "Todas" },
              { value: "youtube", label: "YouTube" },
              { value: "reddit", label: "Reddit" },
              { value: "twitter", label: "Twitter" },
              { value: "tiktok", label: "TikTok" },
              { value: "instagram", label: "Instagram" },
            ]}
            value={selectedDashboardPlatforms}
            onChange={setSelectedDashboardPlatforms}
          />
        </div>
        <div className="min-w-[12rem] w-[12rem]">
          <p className="text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
            Sentimiento
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-300 bg-gradient-to-r from-purple-500/10 to-blue-600/10 border border-purple-500/20 rounded-full">
              IA
            </span>
          </p>
          <MultiSelect
            className="w-full"
            options={dashboardSentimentOptions}
            value={selectedDashboardSentiments}
            onChange={setSelectedDashboardSentiments}
            placeholder="Todos"
          />
        </div>
        <div className="min-w-[12rem] w-[12rem]">
          <p className="text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
            Clasificación
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-300 bg-gradient-to-r from-purple-500/10 to-blue-600/10 border border-purple-500/20 rounded-full">
              IA
            </span>
          </p>
          <MultiSelect
            className="w-full"
            options={dashboardAiTagOptions}
            value={selectedDashboardAiTags}
            onChange={setSelectedDashboardAiTags}
            placeholder="Todas"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={clearDashboardFilters}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      {dashLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-400" />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                          {kpiMoMDisplay}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>En comparación con la semana pasada</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{kpiTotal.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total de menciones</div>
              </CardContent>
            </Card>

            <SentimentKPI sentiment="positive" icon={Smile} color="green" filters={sentimentKpiFilters} />

            <SentimentKPI sentiment="negative" icon={Frown} color="red" filters={sentimentKpiFilters} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm h-[400px]">
              <CardContent className="p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="font-semibold text-white">Palabras más mencionadas</p>
                </div>
                <div className="flex-1">
                  {dashLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <WordCloud words={topWords} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm h-[400px]">
              <CardContent className="p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="font-semibold text-white">Menciones por categoría</p>
                </div>
                <div className="flex-1">
                  {dashLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <TagMentionsBarChart data={tagCounts} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm h-[400px]">
              <CardContent className="p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="font-semibold text-white">Top 10 orígenes de menciones</p>
                </div>
                <div className="flex-1">
                  {dashLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ActiveSourcesBarChart data={sourceTop} />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm h-[400px] lg:col-span-3">
              <CardContent className="p-6 space-y-4 h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <p className="font-semibold text-white">Evolución de menciones</p>
                </div>
                <div className="flex-1">
                  {dashLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <MentionsLineChart data={series} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </section>
  )
}

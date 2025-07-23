'use client'

import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts'
import { useNotionStyles } from '@/hooks/useNotionStyles'
import { cn } from '@/lib/design-system'

export type ChartType = 'line' | 'bar' | 'area' | 'pie'

export interface NotionChartProps {
  type: ChartType
  data: any[]
  dataKey?: string | string[]
  xDataKey?: string
  height?: number
  width?: number | string
  title?: string
  description?: string
  colors?: string[]
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  className?: string
  animate?: boolean
  stacked?: boolean
}

// Notion-Style Farben für Charts
const NOTION_CHART_COLORS = [
  '#529cca', // blue
  '#6ba085', // green
  '#e07c7c', // red
  '#dfab01', // yellow
  '#a47bb3', // purple
  '#e79a57', // orange
  '#d6709f', // pink
  '#9b9a97', // gray
]

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  const styles = useNotionStyles()
  
  if (active && payload && payload.length) {
    return (
      <div className={cn(
        styles.card.base,
        'p-3 shadow-notion-lg dark:shadow-notion-dark-lg'
      )}>
        <p className={cn(styles.text.small, 'font-medium mb-1')}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className={styles.text.small} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function NotionChart({
  type,
  data,
  dataKey,
  xDataKey = 'name',
  height = 300,
  width = '100%',
  title,
  description,
  colors = NOTION_CHART_COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  animate = true,
  stacked = false,
}: NotionChartProps) {
  const styles = useNotionStyles()

  // Normalisiere dataKey zu Array
  const dataKeys = Array.isArray(dataKey) 
    ? dataKey 
    : dataKey 
    ? [dataKey] 
    : Object.keys(data[0] || {}).filter(key => key !== xDataKey)

  // Chart-spezifische Props
  const chartProps = {
    data,
    margin: { top: 5, right: 5, left: 5, bottom: 5 }
  }

  // Axis Props
  const axisProps = {
    stroke: '#9b9a97',
    style: { fontSize: 12 }
  }

  // Grid Props
  const gridProps = {
    strokeDasharray: '3 3',
    stroke: '#e9e9e8',
    strokeOpacity: 0.5
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xDataKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={animate ? 1500 : 0}
              />
            ))}
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart {...chartProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xDataKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[3, 3, 0, 0]}
                animationDuration={animate ? 1500 : 0}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </BarChart>
        )

      case 'area':
        return (
          <AreaChart {...chartProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey={xDataKey} {...axisProps} />
            <YAxis {...axisProps} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.6}
                animationDuration={animate ? 1500 : 0}
                stackId={stacked ? 'stack' : undefined}
              />
            ))}
          </AreaChart>
        )

      case 'pie':
        return (
          <PieChart>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            <Pie
              data={data}
              dataKey={dataKeys[0]}
              nameKey={xDataKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              animationDuration={animate ? 1500 : 0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn(styles.card.base, className)}>
      {(title || description) && (
        <div className={styles.card.header}>
          {title && <h3 className={styles.card.title}>{title}</h3>}
          {description && <p className={styles.card.description}>{description}</p>}
        </div>
      )}
      
      <ResponsiveContainer width={width} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
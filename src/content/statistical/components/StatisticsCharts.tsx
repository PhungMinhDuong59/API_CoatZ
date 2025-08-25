import {
  Box,
  Card,
  CardContent,
  useTheme,
  alpha,
  Typography
} from '@mui/material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';

// Interface định nghĩa props truyền vào component
interface StatisticsChartsProps {
  data: any[]; // dữ liệu doanh thu: [{ date, totalAmount }]
  loading: boolean; // trạng thái loading dữ liệu
  formatYAxis: (value: number) => string; // hàm format cho trục Y
  formatTooltip: (value: any) => string; // hàm format giá trị trong tooltip
}

const StatisticsCharts = ({
  data,
  loading,
  formatYAxis,
  formatTooltip
}: StatisticsChartsProps) => {
  const theme = useTheme(); // hook lấy theme của MUI

  // Tìm giá trị lớn nhất & nhỏ nhất trong dữ liệu (để highlight)
  const maxValue = Math.max(...data.map(item => item.totalAmount));
  const minValue = Math.min(...data.map(item => item.totalAmount));

  // Tooltip custom hiển thị khi hover vào điểm trên chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value; // lấy giá trị totalAmount
      const isMax = value === maxValue; // có phải max?
      const isMin = value === minValue; // có phải min?
      
      return (
        <Card sx={{ 
          p: 2,
          boxShadow: theme.shadows[3], // đổ bóng
          bgcolor: 'background.paper', // nền trắng
          border: '1px solid',
          borderColor: isMax ? 'success.main' : isMin ? 'error.main' : 'divider' // màu viền theo giá trị
        }}>
          {/* Hiển thị ngày */}
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          {/* Hiển thị giá trị doanh thu */}
          <Typography 
            variant="h6" 
            color={isMax ? 'success.main' : isMin ? 'error.main' : 'primary.main'}
            sx={{ mt: 1 }}
          >
            {formatTooltip(value)}
          </Typography>
        </Card>
      );
    }
    return null; // nếu không active thì không hiển thị
  };

  return (
    <Card>
      <CardContent>
        <Box height={400}>
          {/* ResponsiveContainer giúp chart tự co dãn theo kích thước cha */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              {/* Gradient cho phần fill của Area */}
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme.colors.primary.main}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.colors.primary.main}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              {/* Lưới của biểu đồ */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha(theme.colors.alpha.black[100], 0.1)}
                vertical={false} // ẩn lưới dọc
              />

              {/* Trục X hiển thị ngày */}
              <XAxis
                dataKey="date"
                stroke={theme.colors.alpha.black[70]}
                tickLine={false}
                axisLine={false}
                dy={10} // đẩy nhãn xuống dưới
              />

              {/* Trục Y hiển thị doanh thu */}
              <YAxis
                tickFormatter={formatYAxis} // dùng hàm format
                stroke={theme.colors.alpha.black[70]}
                tickLine={false}
                axisLine={false}
                dx={-10} // đẩy nhãn sang trái
              />

              {/* Tooltip */}
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: theme.colors.primary.main,
                  strokeWidth: 2,
                  strokeDasharray: '3 3'
                }}
              />

              {/* Vẽ Area (đường + nền) */}
              <Area
                type="monotone"
                dataKey="totalAmount" // dữ liệu chính là totalAmount
                stroke={theme.colors.primary.main} // màu đường
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)" // fill theo gradient đã định nghĩa
                dot={{ // chấm nhỏ trên đường
                  r: 4,
                  fill: theme.colors.primary.main,
                  strokeWidth: 2,
                  stroke: theme.palette.background.paper
                }}
                activeDot={{ // chấm khi hover
                  r: 6,
                  fill: theme.colors.primary.main,
                  strokeWidth: 2,
                  stroke: theme.palette.background.paper
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatisticsCharts;

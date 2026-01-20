// // components/dashboard/StatsCard.js
// export default function StatsCard({ title, value, icon }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center">
//         <div className="text-2xl mr-4">{icon}</div>
//         <div>
//           <p className="text-gray-500 text-sm">{title}</p>
//           <p className="text-2xl font-bold">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StatsCard({ title, value, icon }) {
  return (
    <Card className="shadow-sm border rounded-xl hover:shadow-md transition-all bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <span className="text-3xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}

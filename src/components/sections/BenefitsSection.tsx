import { Card } from "@/components/ui/card"
import { CircleDollarSign, Zap, Shield, Users, Gift } from "lucide-react"

const benefits = [
  {
    icon: Gift,
    title: "БЕСПЛАТНАЯ*",
    subtitle: "диагностика",
    color: "text-gray-500",
    bg: "bg-gray-50",
    hoverBg: "group-hover:bg-gray-100",
  },
  {
    icon: CircleDollarSign,
    title: "Недорого",
    subtitle: "Конкурентные цены",
    color: "text-emerald-400",
    bg: "bg-emerald-50",
    hoverBg: "group-hover:bg-emerald-100",
  },
  {
    icon: Users,
    title: "Профессионально",
    subtitle: "Опытные мастера",
    color: "text-amber-400",
    bg: "bg-amber-50",
    hoverBg: "group-hover:bg-amber-100",
  },
  {
    icon: Zap,
    title: "Быстро",
    subtitle: "Ремонт пока ждете",
    color: "text-orange-400",
    bg: "bg-orange-50",
    hoverBg: "group-hover:bg-orange-100",
  },
  {
    icon: Shield,
    title: "С гарантией",
    subtitle: "2 года гарантии",
    color: "text-indigo-400",
    bg: "bg-indigo-50",
    hoverBg: "group-hover:bg-indigo-100",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Почему мы? We don't chack, we fix!
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow duration-300 group cursor-default"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={`${benefit.bg} ${benefit.hoverBg} p-4 rounded-full group-hover:scale-110 transition-all`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {benefit.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

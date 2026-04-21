import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BookOpen, ShieldCheck, Cpu } from 'lucide-react'
import { ReactNode } from 'react'

export function Features() {
    return (
        <section className="py-16 md:py-32 bg-black">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-black lg:text-5xl text-white font-mono uppercase tracking-tight">Built for the Modern Reader</h2>
                    <p className="mt-4 text-neutral-400 font-mono">Advanced infrastructure for your physical and digital library management.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group border border-white/5 bg-neutral-950 shadow-2xl">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <BookOpen className="size-6 text-white" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-black text-white font-mono uppercase tracking-tight">Personalized Discovery</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-neutral-400 font-mono">Find your next favorite book with tailored recommendations based on your unique reading history.</p>
                        </CardContent>
                    </Card>

                    <Card className="group border border-white/5 bg-neutral-950 shadow-2xl">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <ShieldCheck className="size-6 text-white" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-black text-white font-mono uppercase tracking-tight">Cloud Sovereignty</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-neutral-400 font-mono">Your data, your library. Securely managed with AWS DynamoDB and IAM for total privacy and control.</p>
                        </CardContent>
                    </Card>

                    <Card className="group border border-white/5 bg-neutral-950 shadow-2xl">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Cpu className="size-6 text-white" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-black text-white font-mono uppercase tracking-tight">Intelligent Insights</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-neutral-400 font-mono">Advanced cataloging and real-time inventory tracking powered by smart AWS-based backend processing.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div className="absolute inset-0 [--border:#333] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"/>
        <div className="bg-black absolute inset-0 m-auto flex size-12 items-center justify-center border border-white/10">{children}</div>
    </div>
)

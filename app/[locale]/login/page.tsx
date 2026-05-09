"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Lock, Mail, Phone, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useLogin } from "@/hooks/use-auth"
import { LoginRequest, loginSchema } from "@/types/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

const ORBS = [
  { size: 500, x: "-10%", y: "-20%", duration: 20, delay: 0 },
  { size: 380, x: "65%", y: "55%", duration: 26, delay: 3 },
  { size: 280, x: "38%", y: "-15%", duration: 18, delay: 6 },
  { size: 320, x: "-8%", y: "50%", duration: 22, delay: 9 },
]

const STARS = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 5,
}))

type LoginMethod = "email" | "mobile"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [greeting, setGreeting] = useState("Welcome back")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const { mutate, isPending } = useLogin()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
      return
    }

    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 17) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")

    const handleMouse = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      setMousePos({ x, y })

      // Calculate tilt (3D effect)
      const tiltX = (y - 0.5) * 12 // 12 deg max tilt
      const tiltY = (x - 0.5) * -12
      setRotateX(tiltX)
      setRotateY(tiltY)
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  const onSubmit = (data: LoginRequest) => {
    mutate(data)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      {/* System Status Badge */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1.5 shadow-sm backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          System Online
        </span>
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.5,
          transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />

      {/* Floating Orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, color-mix(in oklch, var(--foreground) 6%, transparent), transparent 70%)`,
            filter: "blur(50px)",
          }}
          animate={{
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 50, -20, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Twinkling Stars */}
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            background: "white",
            boxShadow: `0 0 ${s.size * 4}px white`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center glow */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, color-mix(in oklch, var(--primary) 8%, transparent), transparent 70%)`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(30px)",
        }}
      />

      {/* Corner SVG accents */}
      <div className="pointer-events-none absolute top-0 left-0 h-56 w-56 opacity-15">
        <svg width="224" height="224" viewBox="0 0 224 224" fill="none">
          {[0, 56, 112, 168].map((v) => (
            <g key={v}>
              <line
                x1={v}
                y1="0"
                x2={v}
                y2="224"
                stroke="var(--foreground)"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1={v}
                x2="224"
                y2={v}
                stroke="var(--foreground)"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rotate-180 opacity-15">
        <svg width="224" height="224" viewBox="0 0 224 224" fill="none">
          {[0, 56, 112, 168].map((v) => (
            <g key={v}>
              <line
                x1={v}
                y1="0"
                x2={v}
                y2="224"
                stroke="var(--foreground)"
                strokeWidth="0.5"
              />
              <line
                x1="0"
                y1={v}
                x2="224"
                y2={v}
                stroke="var(--foreground)"
                strokeWidth="0.5"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* CARD */}
      <motion.div
        className="relative z-10 w-full max-w-lg px-4"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        style={{ perspective: 1000 }}
      >
        {/* Rainbow border wrapper */}
        <div
          className="group relative rounded-xl"
          style={{
            padding: "2px",
            overflow: "hidden",
            boxShadow: `
              0 0 0 1px color-mix(in oklch, var(--foreground) 10%, transparent),
              0 20px 50px 0 color-mix(in oklch, var(--foreground) 20%, transparent),
              0 40px 100px -20px color-mix(in oklch, var(--foreground) 25%, transparent),
              0 -10px 40px 0 color-mix(in oklch, var(--foreground) 10%, transparent)
            `,
          }}
        >
          {/* Rainbow beam 1 — clockwise */}
          <motion.div
            className="pointer-events-none absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "300%",
              aspectRatio: "1",
              translateX: "-50%",
              translateY: "-50%",
              background:
                "conic-gradient(transparent 0deg, transparent 280deg, hsl(0,100%,65%) 300deg, hsl(45,100%,65%) 320deg, hsl(120,100%,60%) 340deg, hsl(180,100%,60%) 355deg, transparent 360deg)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          {/* Rainbow beam 2 — counter-clockwise */}
          <motion.div
            className="pointer-events-none absolute"
            style={{
              left: "50%",
              top: "50%",
              width: "300%",
              aspectRatio: "1",
              translateX: "-50%",
              translateY: "-50%",
              background:
                "conic-gradient(transparent 0deg, transparent 280deg, hsl(240,100%,70%) 300deg, hsl(280,100%,70%) 320deg, hsl(320,100%,70%) 340deg, hsl(360,100%,65%) 355deg, transparent 360deg)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Actual Card */}
          <Card className="relative rounded-[10px] border-0 bg-card">
            <CardHeader className="flex flex-col items-center space-y-1 pt-6 pb-4">
              <motion.div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary"
                animate={{
                  boxShadow: [
                    "0 0 0 0px color-mix(in oklch, var(--primary) 35%, transparent)",
                    "0 0 0 10px color-mix(in oklch, var(--primary) 0%, transparent)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              >
                <Lock className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {greeting},
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              {/* Email / Mobile Tabs */}
              <div className="mb-5 flex gap-1 rounded-lg bg-muted p-1">
                {(["email", "mobile"] as LoginMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setLoginMethod(method)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      loginMethod === method
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {method === "email" ? "Email" : "Mobile"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email or Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="identifier">
                    {loginMethod === "email" ? "Email" : "Mobile Number"}
                  </Label>
                  <div className="relative">
                    {loginMethod === "email" ? (
                      <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    ) : (
                      <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    )}
                    <Input
                      id="identifier"
                      placeholder={
                        loginMethod === "email"
                          ? "name@example.com"
                          : "+91 00000 00000"
                      }
                      type={loginMethod === "email" ? "email" : "tel"}
                      className={`h-12 pl-10 ${errors.identifier ? "border-destructive" : ""}`}
                      {...register("identifier")}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="text-xs text-destructive">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      variant="link"
                      className="h-auto px-0 text-xs font-normal text-muted-foreground hover:text-foreground"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`h-12 pr-12 pl-10 ${errors.password ? "border-destructive" : ""}`}
                      placeholder="••••••••"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-sm leading-none text-muted-foreground select-none"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="h-11 w-full font-semibold"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Developed by Credit */}
      <motion.div
        className="fixed bottom-6 z-10 flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-2 shadow-sm backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Developed by
        </span>
        <div className="mx-1 h-3 w-[1px] bg-border" />
        <span className="text-xs font-bold tracking-tight text-foreground">
          Arfaj Sheru
        </span>
      </motion.div>
    </div>
  )
}

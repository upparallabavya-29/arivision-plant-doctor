import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, ArrowRight, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/auth";
import FallingLeaves from "@/components/FallingLeaves";
import { toast } from "sonner";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            registerUser({ name, email, password });
            toast.success("Account created successfully!");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden py-10 px-4">
            <FallingLeaves />

            {/* Background Decor */}
            <div
                className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"
            />
            <div
                className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl opacity-50 pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[420px] relative z-10"
            >
                <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                    <motion.div
                        whileHover={{ rotate: -10, scale: 1.1 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                            background: "linear-gradient(135deg, hsl(153 75% 12%) 0%, hsl(160 60% 25%) 100%)",
                            boxShadow: "0 0 16px hsl(153 75% 12% / 0.3)",
                        }}
                    >
                        <Leaf className="h-5 w-5 text-white" strokeWidth={2.2} />
                    </motion.div>
                    <span className="font-display font-bold text-xl tracking-tight text-foreground transition-colors group-hover:text-primary">
                        AriVision AI
                    </span>
                </Link>

                <div
                    className="rounded-3xl border border-white/20 bg-card/60 p-8 shadow-2xl backdrop-blur-xl"
                >
                    <div className="mb-8">
                        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mb-2">
                            Create Account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Join the clinical-grade plant diagnostic lab
                        </p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Create a strong password"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground ml-1">Must be at least 6 characters</p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-xl h-11 font-semibold text-base shadow-lg transition-transform active:scale-[0.98]"
                            disabled={loading}
                            style={{
                                background: "linear-gradient(135deg, hsl(153 75% 30%) 0%, hsl(160 60% 25%) 100%)",
                            }}
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign Up
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-primary hover:underline transition-colors">
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

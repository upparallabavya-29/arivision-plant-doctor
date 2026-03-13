import { supabase } from "./supabaseClient";

export interface ScanRecord {
    id?: string;
    user_id?: string;
    plant: string;
    disease: string;
    confidence: number;
    status: string;
    created_at?: string;
}

export async function saveScan(scan: Omit<ScanRecord, "id" | "user_id" | "created_at">) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("No active session found");

    const { data, error } = await supabase
        .from("scans")
        .insert([
            {
                ...scan,
                user_id: session.user.id,
            },
        ])
        .select();

    if (error) throw error;
    return data[0];
}

export async function getScans() {
    const { data, error } = await supabase
        .from("scans")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as ScanRecord[];
}

export async function getScanStats() {
    const { data, error } = await supabase
        .from("scans")
        .select("disease");

    if (error) throw error;

    const totalScans = data.length;
    const uniqueDiseases = new Set(data.map((s) => s.disease)).size;

    return {
        totalScans,
        uniqueDiseases,
    };
}

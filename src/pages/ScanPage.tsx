import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, X, ArrowRight, Leaf, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ScanAnimation from "@/components/ScanAnimation";
import FallingLeaves from "@/components/FallingLeaves";
import CameraCapture from "@/components/CameraCapture";
import { getRandomDiagnosis, PLANTS } from "@/lib/mockDiagnosis";
import { saveScan } from "@/lib/database";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ScanPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = useCallback((file: File) => {
    // Attempt to auto-detect plant from filename
    const filename = file.name.toLowerCase();
    const detectedPlant = PLANTS.find(p => filename.includes(p.toLowerCase()));
    if (detectedPlant) {
      setSelectedPlant(detectedPlant);
    } else {
      setSelectedPlant(""); // Reset if no detection
    }

    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const startScan = () => {
    if (!image) return;
    setIsScanning(true);
  };

  const onScanComplete = async () => {
    const result = getRandomDiagnosis(selectedPlant);

    try {
      await saveScan({
        plant: result.plant,
        disease: result.disease,
        confidence: result.confidence,
        status: result.status
      });
    } catch (error) {
      console.error("Failed to save scan to Supabase:", error);
    }

    setIsScanning(false);
    navigate("/results", { state: { result, imageSrc: image } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20 relative">
      <FallingLeaves />
      <TopBar />
      <ScanAnimation isScanning={isScanning} imageSrc={image} onComplete={onScanComplete} />

      <main className="flex-1 px-4 py-6 relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold mb-1">Scan Leaf</h1>
          <p className="text-sm text-muted-foreground mb-6">Capture or upload a leaf image for diagnosis</p>

          {!image ? (
            <div className="space-y-3">
              {/* Camera capture */}
              <button
                onClick={() => setIsCameraOpen(true)}
                className="flex w-full items-center gap-4 rounded-lg bg-primary p-5 text-primary-foreground transition-transform active:scale-[0.98]"
              >
                <Camera className="h-6 w-6" />
                <div className="text-left">
                  <p className="font-display text-sm font-semibold">Take Photo</p>
                  <p className="text-xs opacity-80">Use device camera</p>
                </div>
              </button>

              {/* File upload */}
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-5 transition-transform active:scale-[0.98]"
              >
                <Upload className="h-6 w-6 text-accent" />
                <div className="text-left">
                  <p className="font-display text-sm font-semibold">Upload Image</p>
                  <p className="text-xs text-muted-foreground">Select from gallery</p>
                </div>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {/* Drop zone */}
              <div
                className="mt-4 flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
              >
                <p className="text-xs text-muted-foreground">Or drag and drop an image here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative overflow-hidden rounded-lg border border-border">
                <img src={image} alt="Leaf preview" className="w-full object-cover" style={{ maxHeight: "50vh" }} />
                <button
                  onClick={() => setImage(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/70 text-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Plant Selection */}
              <div className="space-y-3 rounded-xl bg-accent/5 p-4 border border-accent/10">
                <Label htmlFor="plant-select" className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <Leaf className="h-4 w-4" />
                  What plant is this?
                </Label>

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between h-12 bg-card border-border font-normal text-left"
                    >
                      <span className="truncate">
                        {selectedPlant
                          ? PLANTS.find((plant) => plant === selectedPlant)
                          : "Select plant type (Searchable...)"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-0 z-50">
                    <Command className="border border-border">
                      <CommandInput placeholder="Search plant species..." />
                      <CommandList className="max-h-[250px]">
                        <CommandEmpty>No plant species found.</CommandEmpty>
                        <CommandGroup heading="Available Plants">
                          {PLANTS.map((plant) => (
                            <CommandItem
                              key={plant}
                              value={plant}
                              onSelect={(currentValue) => {
                                // Match the value casing
                                const matchedPlant = PLANTS.find(p => p.toLowerCase() === currentValue.toLowerCase()) || currentValue;
                                setSelectedPlant(matchedPlant === selectedPlant ? "" : matchedPlant);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPlant === plant ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {plant}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {!selectedPlant && (
                  <p className="text-[11px] text-destructive font-medium animate-pulse">
                    Please select a plant type to proceed with analysis.
                  </p>
                )}
              </div>

              {/* Analyze button */}
              <Button
                onClick={startScan}
                size="lg"
                className="w-full h-14 text-lg gap-2 shadow-lg shadow-primary/20"
                disabled={!selectedPlant}
              >
                Analyze Pathology
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav />
      {
        isCameraOpen && (
          <CameraCapture
            onCapture={(imageSrc) => {
              setImage(imageSrc);
              setIsCameraOpen(false);
            }}
            onClose={() => setIsCameraOpen(false)}
          />
        )
      }
    </div >
  );
};

export default ScanPage;

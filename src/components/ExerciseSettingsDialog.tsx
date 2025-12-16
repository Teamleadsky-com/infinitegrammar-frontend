import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGrammarSections } from "@/data/grammarSections";

interface ExerciseSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLevel: string;
  currentSection: string;
  currentGrammar: string | null;
  onApply: (level: string, section: string, grammar: string | null) => void;
}

const levels = [
  { id: "a1", name: "A1" },
  { id: "a2", name: "A2" },
  { id: "b1", name: "B1" },
  { id: "b2", name: "B2" },
  { id: "c1", name: "C1" },
];

const sections = [
  { id: "verben", name: "Verben" },
  { id: "adjektive", name: "Adjektive" },
  { id: "artikel", name: "Artikel" },
  { id: "präpositionen", name: "Präpositionen" },
];

export const ExerciseSettingsDialog = ({
  open,
  onOpenChange,
  currentLevel,
  currentSection,
  currentGrammar,
  onApply,
}: ExerciseSettingsDialogProps) => {
  const { t } = useTranslation();
  const [level, setLevel] = useState(currentLevel);
  const [section, setSection] = useState(currentSection);
  const [grammar, setGrammar] = useState<string | null>(currentGrammar);
  const [availableGrammar, setAvailableGrammar] = useState<Array<{ id: string; name: string }>>([]);

  // Update available grammar sections when level or section changes
  useEffect(() => {
    if (level && section) {
      const sections = getGrammarSections(level, section);
      setAvailableGrammar(sections.map((s) => ({ id: s.id, name: s.name })));

      // Reset grammar selection if it's not available in the new level/section combination
      if (grammar && !sections.find((s) => s.id === grammar)) {
        setGrammar(null);
      }
    }
  }, [level, section, grammar]);

  // Sync with props when dialog opens
  useEffect(() => {
    if (open) {
      setLevel(currentLevel);
      setSection(currentSection);
      setGrammar(currentGrammar);
    }
  }, [open, currentLevel, currentSection, currentGrammar]);

  const handleApply = () => {
    onApply(level, section, grammar);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('exercise.settings')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Level Selection */}
          <div className="space-y-2">
            <Label htmlFor="level">{t('exercise.level')}</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((lvl) => (
                  <SelectItem key={lvl.id} value={lvl.id}>
                    {lvl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Selection */}
          <div className="space-y-2">
            <Label htmlFor="section">{t('exercise.topic')}</Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger id="section">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((sec) => (
                  <SelectItem key={sec.id} value={sec.id}>
                    {sec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grammar Focus Selection */}
          <div className="space-y-2">
            <Label htmlFor="grammar">{t('exercise.grammarFocus')}</Label>
            <Select
              value={grammar || "all"}
              onValueChange={(value) => setGrammar(value === "all" ? null : value)}
            >
              <SelectTrigger id="grammar">
                <SelectValue placeholder={t('exercise.allGrammar')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('exercise.allGrammar')}</SelectItem>
                {availableGrammar.map((gram) => (
                  <SelectItem key={gram.id} value={gram.id}>
                    {gram.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('exercise.cancel')}
          </Button>
          <Button onClick={handleApply}>{t('exercise.apply')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

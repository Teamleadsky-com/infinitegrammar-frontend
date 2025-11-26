import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOPIC_ORDER, areAllExercisesCompletedForTopic } from "@/utils/exerciseCompletion";
import { GrammarUiTopicId } from "@/data/grammarSections";

interface ProgressionBreadcrumbProps {
  level: string;
  currentTopic: string;
  allExercises: any[];
  className?: string;
}

export const ProgressionBreadcrumb = ({
  level,
  currentTopic,
  allExercises,
  className,
}: ProgressionBreadcrumbProps) => {
  const currentTopicId = currentTopic.toLowerCase() as GrammarUiTopicId;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {TOPIC_ORDER.map((topic, index) => {
        const isCompleted = areAllExercisesCompletedForTopic(level, topic, allExercises);
        const isCurrent = topic === currentTopicId;
        const isUpcoming = TOPIC_ORDER.indexOf(topic) > TOPIC_ORDER.indexOf(currentTopicId);

        return (
          <div key={topic} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all",
                isCurrent && "bg-primary text-primary-foreground shadow-md scale-105",
                isCompleted && !isCurrent && "bg-success-light text-success border border-success",
                isUpcoming && "bg-muted text-muted-foreground opacity-60"
              )}
            >
              {isCompleted && !isCurrent && <Check className="h-3 w-3" />}
              <span className="capitalize">{topic}</span>
            </div>
            {index < TOPIC_ORDER.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </div>
  );
};

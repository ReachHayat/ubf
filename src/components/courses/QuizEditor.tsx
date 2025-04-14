
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseQuiz, QuizQuestion } from "@/types/course";
import { PlusCircle, Trash2 } from "lucide-react";

interface QuizEditorProps {
  quiz: CourseQuiz | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (quiz: CourseQuiz) => void;
}

export function QuizEditor({ quiz, open, onOpenChange, onSave }: QuizEditorProps) {
  const [formData, setFormData] = useState<CourseQuiz>({
    id: "",
    title: "",
    description: "",
    timeLimit: 15,
    questions: [],
    status: "not_started"
  });

  useEffect(() => {
    if (quiz) {
      setFormData({
        ...quiz
      });
    } else {
      // New quiz with default values and generated ID
      setFormData({
        id: Math.random().toString(36).substring(2, 9),
        title: "",
        description: "",
        timeLimit: 15,
        questions: [{
          id: Math.random().toString(36).substring(2, 9),
          question: "",
          type: "multiple_choice",
          options: ["", "", "", ""],
          correctAnswer: ""
        }],
        status: "not_started"
      });
    }
  }, [quiz, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "timeLimit" ? Number(value) : value
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      if (!updatedQuestions[questionIndex].options) {
        updatedQuestions[questionIndex].options = [];
      }
      const options = [...updatedQuestions[questionIndex].options!];
      options[optionIndex] = value;
      updatedQuestions[questionIndex].options = options;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleTypeChange = (questionIndex: number, type: "multiple_choice" | "true_false" | "short_answer") => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].type = type;
      
      // Reset options based on the type
      if (type === "multiple_choice") {
        updatedQuestions[questionIndex].options = ["", "", "", ""];
        updatedQuestions[questionIndex].correctAnswer = "";
      } else if (type === "true_false") {
        updatedQuestions[questionIndex].options = ["True", "False"];
        updatedQuestions[questionIndex].correctAnswer = "";
      } else {
        updatedQuestions[questionIndex].options = [];
        updatedQuestions[questionIndex].correctAnswer = "";
      }
      
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].correctAnswer = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const addQuestion = () => {
    setFormData(prev => {
      const newQuestion: QuizQuestion = {
        id: Math.random().toString(36).substring(2, 9),
        question: "",
        type: "multiple_choice",
        options: ["", "", "", ""],
        correctAnswer: ""
      };
      
      return {
        ...prev,
        questions: [...prev.questions, newQuestion]
      };
    });
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one question
    if (formData.questions.length === 0) {
      alert("Please add at least one question to the quiz.");
      return;
    }
    
    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      
      if (!q.question.trim()) {
        alert(`Question ${i + 1} has no text.`);
        return;
      }
      
      if (q.type === "multiple_choice") {
        if (!q.options || q.options.filter(o => o.trim()).length < 2) {
          alert(`Question ${i + 1} needs at least two options.`);
          return;
        }
        
        if (!q.correctAnswer) {
          alert(`Question ${i + 1} has no correct answer selected.`);
          return;
        }
      } else if (q.type === "true_false") {
        if (!q.correctAnswer) {
          alert(`Question ${i + 1} has no correct answer selected.`);
          return;
        }
      }
    }
    
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substring(2, 9)
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter quiz description"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
            <Input
              id="timeLimit"
              name="timeLimit"
              type="number"
              min="1"
              value={formData.timeLimit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Questions</Label>
              <Button type="button" size="sm" onClick={addQuestion} className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Question
              </Button>
            </div>

            {formData.questions.map((question, qIndex) => (
              <div key={question.id || qIndex} className="p-4 border rounded-md space-y-3">
                <div className="flex justify-between items-start">
                  <Label htmlFor={`question-${qIndex}`} className="text-base font-medium">
                    Question {qIndex + 1}
                  </Label>
                  {formData.questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Textarea
                    id={`question-${qIndex}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                    placeholder="Enter question"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`type-${qIndex}`}>Question Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: "multiple_choice" | "true_false" | "short_answer") => 
                      handleTypeChange(qIndex, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {question.type === "multiple_choice" && (
                  <div className="space-y-3">
                    <Label>Options</Label>
                    {question.options?.map((option, oIndex) => (
                      <div key={oIndex} className="flex gap-2 items-center">
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                        />
                        <div className="w-24">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={question.correctAnswer === option}
                              onChange={() => handleCorrectAnswerChange(qIndex, option)}
                            />
                            Correct
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "true_false" && (
                  <div className="space-y-3">
                    <Label>Correct Answer</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`true-false-${qIndex}`}
                          value="True"
                          checked={question.correctAnswer === "True"}
                          onChange={() => handleCorrectAnswerChange(qIndex, "True")}
                        />
                        True
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`true-false-${qIndex}`}
                          value="False"
                          checked={question.correctAnswer === "False"}
                          onChange={() => handleCorrectAnswerChange(qIndex, "False")}
                        />
                        False
                      </label>
                    </div>
                  </div>
                )}

                {question.type === "short_answer" && (
                  <div className="space-y-2">
                    <Label htmlFor={`answer-${qIndex}`}>Expected Answer (for grading)</Label>
                    <Input
                      id={`answer-${qIndex}`}
                      value={question.correctAnswer || ""}
                      onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                      placeholder="Enter expected answer"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Quiz</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

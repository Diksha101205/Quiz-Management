export function calculateResult(questions, answers) {
  let score = 0;
  const review = questions.map((question) => {
    const selectedIndex = answers[question.id];
    const isSkipped = selectedIndex === undefined;
    const isCorrect = selectedIndex === question.correctIndex;
    const earnedPoints = isSkipped ? 0 : isCorrect ? Number(question.points) : -Number(question.negativePoints || 0);
    score += earnedPoints;
    return {
      questionId: question.id,
      text: question.text,
      options: question.options,
      selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect,
      isSkipped,
      earnedPoints,
      points: question.points,
      explanation: question.explanation
    };
  });

  const totalPoints = questions.reduce((sum, question) => sum + Number(question.points), 0);
  const percentage = totalPoints > 0 ? Math.max(0, (score / totalPoints) * 100) : 0;

  return { score, totalPoints, percentage, review };
}

export function didPass(percentage, passingScorePercent = 60) {
  return Number(percentage) >= Number(passingScorePercent);
}


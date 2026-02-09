
import { Question } from './questions';

type AnswerValue = boolean | number | (string | number)[];
type Answer = { questionId: string; value: AnswerValue; };

/**
 * 分岐条件の評価
 */
function evaluateCondition(conditionType: string, conditionValue: any, answerValue: any): boolean {
  switch (conditionType) {
    case 'equals':
      return answerValue === conditionValue;
    case 'greaterThan':
      return typeof answerValue === 'number' && answerValue > conditionValue;
    case 'lessThan':
      return typeof answerValue === 'number' && answerValue < conditionValue;
    case 'contains':
      return Array.isArray(answerValue) && answerValue.includes(conditionValue);
    default:
      return false;
  }
}

/**
 * 次の質問を決定する
 */
export function getNextQuestion(
  currentQuestion: Question,
  currentAnswerValue: AnswerValue,
  allQuestions: Question[]
): Question | null {
  // 1. フォローアップ質問のチェック
  if (currentQuestion.followUp) {
    let shouldShowFollowUp = false;

    if (currentQuestion.followUpCondition === 'yes') {
      shouldShowFollowUp = currentAnswerValue === true;
    } else if (currentQuestion.followUpCondition === 'no') {
      shouldShowFollowUp = currentAnswerValue === false;
    } else if (currentQuestion.followUpCondition === 'specific' && currentQuestion.followUpTriggerValues) {
      if (Array.isArray(currentAnswerValue)) {
         // 複数選択の場合、トリガー値のいずれかが含まれていればフォローアップを表示
         shouldShowFollowUp = currentAnswerValue.some(val => currentQuestion.followUpTriggerValues!.includes(val));
      } else {
         // 単一選択の場合
         shouldShowFollowUp = currentQuestion.followUpTriggerValues.includes(currentAnswerValue as string | number | boolean);
      }
    }
    
    if (shouldShowFollowUp) {
      return currentQuestion.followUp;
    }
  }

  // 2. 現在の質問がフォローアップ質問だった場合、親質問の次の質問へ
  // (ただし、単純な配列インデックス操作で次の質問を取得するロジックがメインストリームならここは不要かもしれないが、念のため)
  
  // 3. 通常の次の質問へ
  // 現在の質問が全質問リストのどこにあるかを探す
  const currentIndex = allQuestions.findIndex(q => q.id === currentQuestion.id);
  
  // 見つからない場合は終了
  if (currentIndex === -1) return null;

  // 次の質問があればそれを返す
  if (currentIndex + 1 < allQuestions.length) {
      return allQuestions[currentIndex + 1];
  }

  return null;
}

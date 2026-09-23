# Week 3 state and flow test — Prabin Rai

This small browser test checks the state transitions needed for the Smart Study Companion candidate slice without requiring the React app to exist yet.

## Flow checked

1. Start with no saved state.
2. Create a Programming subject.
3. Add one study task with a deadline.
4. Mark the task as completed.
5. Answer a two-question quiz and calculate the score.
6. Reload the page and verify that the subject, completed task, and quiz result remain in `localStorage`.

Open this file in a browser, click **Run state/flow test**, and then click **Reload and verify persistence**. The test uses only sample data and can be cleared with the final button.

## Expected result

The first run reports that each state transition passed. After reload, the saved subject, completed task, and quiz result are restored and the persistence check passes.

## Evidence connection

- Investigation decision: [Issue #4 — manual quiz entry versus question bank](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/4)
- App structure and midterm flow: [Issue #16 — Define the App Structure and Midterm Flow](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/16)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Smart Study Companion state/flow test</title>
  <style>
    body { font: 16px/1.5 system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
    button { margin: .25rem .5rem .25rem 0; padding: .5rem .75rem; }
    .pass { color: #176b35; }
    .fail { color: #a11; }
    pre { background: #f5f5f5; padding: 1rem; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>State/flow test</h1>
  <p>Checks subject creation → task completion → quiz score → reload persistence.</p>
  <button id="run">Run state/flow test</button>
  <button id="reload">Reload and verify persistence</button>
  <button id="clear">Clear test data</button>
  <pre id="output">No test run yet.</pre>

  <script>
    const KEY = "ssc-prabin-state-flow-test";
    const output = document.getElementById("output");

    function readState() {
      try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
      catch { return null; }
    }

    function check(condition, message, results) {
      results.push(`${condition ? "PASS" : "FAIL"}: ${message}`);
      return condition;
    }

    function runFlow() {
      const results = [];
      const state = {
        subject: { id: "programming", name: "Programming" },
        tasks: [{ id: "task-1", title: "Read chapter 1", deadline: "2026-09-30", status: "pending" }],
        quiz: { answers: ["A", "B"], correctAnswers: ["A", "C"], score: 0, total: 2 }
      };

      check(state.subject.name === "Programming", "Programming subject is created", results);
      check(state.tasks.length === 1 && state.tasks[0].status === "pending", "one pending task is added", results);

      state.tasks[0].status = "completed";
      check(state.tasks[0].status === "completed", "the task changes to completed", results);

      state.quiz.score = state.quiz.answers.reduce(
        (score, answer, index) => score + (answer === state.quiz.correctAnswers[index] ? 1 : 0), 0
      );
      check(state.quiz.score === 1 && state.quiz.total === 2, "quiz score is calculated as 1/2", results);

      localStorage.setItem(KEY, JSON.stringify(state));
      check(readState().tasks[0].status === "completed", "completed state is saved", results);
      output.innerHTML = results.map(line => `<span class="${line.startsWith("PASS") ? "pass" : "fail"}">${line}</span>`).join("\n");
    }

    function verifyPersistence() {
      const state = readState();
      const results = [];
      check(Boolean(state), "saved state is available after reload", results);
      check(state && state.subject.name === "Programming", "subject is restored", results);
      check(state && state.tasks[0].status === "completed", "completed task is restored", results);
      check(state && state.quiz.score === 1 && state.quiz.total === 2, "quiz result 1/2 is restored", results);
      output.innerHTML = results.map(line => `<span class="${line.startsWith("PASS") ? "pass" : "fail"}">${line}</span>`).join("\n");
    }

    document.getElementById("run").onclick = runFlow;
    document.getElementById("reload").onclick = verifyPersistence;
    document.getElementById("clear").onclick = () => {
      localStorage.removeItem(KEY);
      output.textContent = "Test data cleared.";
    };
  </script>
</body>
</html>
```

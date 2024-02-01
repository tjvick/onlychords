export function sendAnalyticsEvent() {
  const analyticsData = {
    navigator: window.navigator
  }

  fetch('.netlify/functions/analytics', {
    method: 'POST',
    body: JSON.stringify(analyticsData)
  }).then(response => {
    console.log("analytics function called");
  })
}

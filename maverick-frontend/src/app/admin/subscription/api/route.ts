
// View subscriptions
export async function subscriptionList() {
    const accessToken = localStorage.getItem('access_token');
    const res = await fetch('http://127.0.0.1:8000/api/v1/subscribed-users', {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "authorization": `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    return {
      props: {
        data: data
      }
    };
  }
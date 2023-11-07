import { CreatePlanFormData } from "@/app/component/interfaces";

export async function createPlan(formData: CreatePlanFormData) {
    const body = {
        plan: {
            plan_name: formData.planname,
            description: formData.description,
        },
        price: {
            price: formData.price,
            currency: formData.currency,
            payment_mode: formData.paymentmode,
            payment_type: formData.paymenttype,
            billing_period: formData.billingperiod,
            interval_count: formData.intervalcount,
        }
    };
    const res = await fetch("http://127.0.0.1:8000/api/v1/plans", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(body),
    });

    return res;

}

export async function planList() {
    const accessToken = localStorage.getItem('access_token');
    const res = await fetch("http://127.0.0.1:8000/api/v1/plans", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "authorization": `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    return {
      props: {
        plans: data
      }
    };
  }
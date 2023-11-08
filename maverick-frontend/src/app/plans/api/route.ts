import { CreatePlanFormData, UpdatePlanFormData } from "@/app/component/interfaces";

// Create Plan
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

//View Plan
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

// Update Plan
export async function updatePlan(planId: string, formData: UpdatePlanFormData) {
  const accessToken = localStorage.getItem('access_token');
  const body = {
    plan_name: formData.planname,
    description: formData.description,
  };
  const res = await fetch(`http://127.0.0.1:8000/api/v1/plans/${planId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return {
    props: {
      update: data
    }
  };
}

// Deactivate Plan
export async function  DeactivatePlan(priceId: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/v1/plans/${priceId}/deactivate`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    }
  });
  const data = await res.json();
  return {
    props: {
      deactivate: data
    }
  };
}

// Activate Plan
export async function  ActivatePlan(priceId: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/v1/plans/${priceId}/activate`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    }
  });
  const data = await res.json();
  return {
    props: {
      activate: data
    }
  };
}
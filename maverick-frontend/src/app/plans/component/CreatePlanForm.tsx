"use client";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { CreatePlanProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';
import { useForm } from 'react-hook-form';

export default function CreatePlansForm(
  {
    loading,
    showMessage,
    setShowMessage,
    message,
    messageColor,
    onSubmit,
    formHandleSubmit,
    register,
    errors,
    open,
    setOpen,
  }: CreatePlanProps
) {

  const handleClose = () => {
    setOpen(false);
  };

  const { handleSubmit } = useForm();

  const [selectedPlanName, setSelectedPlanName] = React.useState('')
  const [selectedDescription, setSelectedDescription] = React.useState('')
  const [selectedPrice, setSelectedPrice] = React.useState('')
  const [selectedCurrency, setSelectedCurrency] = React.useState('')
  const [selectedPaymentMode, setSelectedPaymentMode] = React.useState('')
  const [selectedPaymentType, setSelectedPaymentType] = React.useState('')
  const [selectedBillingPeriod, setSelectedBillingPeriod] = React.useState('')
  const [selectedIntervalCount, setSelectedIntervalCount] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState('');

  //selectedPaymentType === 'Recurring'? '' : null

  const handleSelectPaymentType = (event: any) => {
    setSelectedPaymentType(event.target.value);
  }
  const handleSelectChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  const currencies = [
    { value: "INR", label: "INR" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" }];
  const paymentMode = [{ value: 'card', label: 'Card' }];
  const paymentType = [{ value: 'recurring', label: 'Recurring' }, { value: 'one_time', label: 'One Time' }];
  const billingPeriod = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];

  const intervalCount = [
    { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
    { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' },
    { value: '7', label: '7' }, { value: '8', label: '8' }, { value: '9', label: '9' },
    { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
    { value: 'custom', label: 'Custom' }
  ];


  return (
    <div>
      <Dialog className='rounded-md' open={open} onClose={handleClose}>
        <DialogTitle className='ml-6 mr-8 mt-8 text-2xl text-black font-Inter font-bold'>Create Plan</DialogTitle>
        <DialogContentText className='ml-12 mr-8 text-greyplus text-sm font-Inter font-normal leading-6'>
          You can create your new plan here
        </DialogContentText>
        <DialogContent>
          <form onSubmit={formHandleSubmit(onSubmit)} noValidate>
            <Grid className='mt-2'>
              <TextField
                autoFocus
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="planName"
                label="Plan Name"
                type="text"
                onChange={(planName) => setSelectedPlanName(planName.target.value)}
                error={Boolean(errors?.planName)}
                helperText={errors?.planName ? errors?.planName.message : " "}
              />
              <TextField
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="description"
                label="Description"
                type="text"
                onChange={(description) => setSelectedDescription(description.target.value)}
                error={Boolean(errors?.description)}
                helperText={errors?.description ? errors?.description.message : " "}
              />
              <TextField
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="price"
                label="Price"
                type="text"
                onChange={(price) => setSelectedPrice(price.target.value)}
                error={Boolean(errors?.price)}
                helperText={errors?.price ? errors?.price.message : " "}
              />
              <TextField
                required
                select
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="currency"
                label="Currency"
                type="text"
                onChange={(currency) => setSelectedCurrency(currency.target.value)}
                error={Boolean(errors?.currency)}
                helperText={errors?.currency ? errors?.currency.message : " "}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="paymentMode"
                label="Payment Mode"
                onChange={(paymentMode) => setSelectedPaymentMode(paymentMode.target.value)}
                error={Boolean(errors?.paymentMode)}
                helperText={errors?.paymentMode ? errors?.paymentMode.message : " "}
              >
                {paymentMode.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                value={selectedPaymentType}
                onChange={handleSelectPaymentType}
                id="paymentType"
                label="Payment Type"
                error={Boolean(errors?.paymentType)}
                helperText={errors?.paymentType ? errors?.paymentType.message : " "}
              >
                {paymentType.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {selectedPaymentType === 'recurring' && (
                <div>
                  <TextField
                    select
                    required
                    className='w-full-six h-20 ml-6 border-greyplus'
                    margin="dense"
                    id="billingPeriod"
                    label="Billing Period"
                    onChange={(billingPeriod) => setSelectedBillingPeriod(billingPeriod.target.value)}
                    error={Boolean(errors?.billingPeriod)}
                    helperText={errors?.billingPeriod ? errors?.billingPeriod.message : " "}
                  >
                    {billingPeriod.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    required
                    className='w-full-six h-20 ml-6 border-greyplus'
                    margin="dense"
                    id="intervalCount"
                    label="Interval Count"
                    value={selectedValue}
                    onChange={handleSelectChange}
                    // {...register("intervalCount")}
                    error={Boolean(errors?.intervalCount)}
                    helperText={errors?.intervalCount ? errors?.intervalCount.message : " "}
                  >
                    {intervalCount.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  {selectedValue === 'custom' && (
                    <TextField
                      required
                      className='w-full-six h-20 ml-6 border-greyplus'
                      margin="dense"
                      id="intervalCount"
                      label="Enter Custom Value for interval count only in numbers"
                      onChange={(intervalCount) => setSelectedIntervalCount(intervalCount.target.value)}
                      // {...register("intervalCount")}
                      error={Boolean(errors?.intervalCount)}
                      helperText={errors?.intervalCount ? errors?.intervalCount.message : " "}
                    />
                  )}
                </div>
              )}


              {/* <TextField
                    select
                    required
                    className='w-full-six h-20 ml-6 border-greyplus'
                    margin="dense"
                    id="intervalCount"
                    label="Interval Count"
                    onChange={(intervalCount) => setSelectedIntervalCount(intervalCount.target.value)}
                    error={Boolean(errors?.intervalCount)}
                    helperText={errors?.intervalCount ? errors?.intervalCount.message : " "}
                  >
                    {intervalCount.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField> */}
              {/* <TextField
                select
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="intervalCount"
                label="Interval Count"
                value={selectedValue}
                onChange={handleSelectChange}
                // {...register("intervalCount")}
                // error={Boolean(errors?.intervalCount)}
                // helperText={errors?.intervalCount ? errors?.intervalCount.message : " "}
              >
                {intervalCount.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {selectedValue === 'custom' && (
                <TextField
                  required
                  className='w-full-six h-20 ml-6 border-greyplus'
                  margin="dense"
                  id="intervalCount"
                  label="Enter Custom Value for interval count"
                  // {...register("intervalCount")}
                  // error={Boolean(errors?.intervalCount)}
                  // helperText={errors?.intervalCount ? errors?.intervalCount.message : " "}
                />
              )} */}
              <DialogActions>
                <Button
                  className="w-28 h-11 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack"
                  onClick={handleClose}>Cancel</Button>
                <Button
                  className='w-28 h-11 ml-4 -mr-2 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen'
                  variant='contained'
                  type="submit"
                  onClick={handleSubmit((data) => {
                    console.log("planName 1st: ", data.planname)
                    const formData = {
                      planName: selectedPlanName,
                      description: selectedDescription,
                      price: parseFloat(selectedPrice),
                      currency: selectedCurrency,
                      paymentMode: selectedPaymentMode,
                      paymentType: selectedPaymentType,
                      billingPeriod: selectedBillingPeriod === '' ? null : selectedBillingPeriod,
                      intervalCount: parseInt(selectedIntervalCount),
                    };
                    console.log("Interval COunt: ", selectedIntervalCount)
                    formHandleSubmit(onSubmit(formData));
                  })}
                >
                  Create
                </Button>
              </DialogActions>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      {message !== "" ? (
        <Snackbar
          showMessage={showMessage}
          setShowMessage={setShowMessage}
          message={message}
          messageColor={messageColor}
        />
      ) : null}
      {loading ? (
        <Box
          className="text-greyplus mt-2 flex justify-center items-center"
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : null}
    </div>
  );
}
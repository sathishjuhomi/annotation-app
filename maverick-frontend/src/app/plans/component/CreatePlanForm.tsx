"use client";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { CreatePlanProps } from '@/app/component/interfaces';
import Snackbar from '@/app/component/Snackbar';


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

  const [selectedValue, setSelectedValue] = React.useState('');

  const handleSelectChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  console.log("CreatePlanForm: ")

  const paymentMode = [{ value: 'card', label: 'Card' }];
  const paymentType = [{ value: 'recurring', label: 'Recurring' }, { value: 'one_time', label: 'One Time' }];
  const billingPeriod = [
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' },
  ];
  const intervalCount = [
    { value: '1', label: '1' }, { value: '2', label: '2' },
    { value: '3', label: '3' }, { value: '4', label: '4' },
    { value: '5', label: '5' }, { value: '6', label: '6' },
    { value: '7', label: '7' }, { value: '8', label: '8' },
    { value: '9', label: '9' }, { value: '10', label: '10' },
    { value: '11', label: '11' }, { value: '12', label: '12' },
    // { value: 'custom', label: 'Custom' }
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
                id="planname"
                label="Plan Name"
                type="text"
                {...register("planname")}
                error={Boolean(errors?.planname)}
                helperText={errors?.planname ? errors?.planname.message : " "}
              />
              <TextField
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="description"
                label="Description"
                type="text"
                {...register("description")}
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
                {...register("price")}
                error={Boolean(errors?.price)}
                helperText={errors?.price ? errors?.price.message : " "}
              />
              <TextField
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="currency"
                label="Currency"
                type="text"
                {...register("currency")}
                error={Boolean(errors?.currency)}
                helperText={errors?.currency ? errors?.currency.message : " "}
              />
              <TextField
                select
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="paymentmode"
                label="Payment Mode"
                {...register("paymentmode")}
                error={Boolean(errors?.paymentmode)}
                helperText={errors?.paymentmode ? errors?.paymentmode.message : " "}
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
                id="paymenttype"
                label="Payment Type"
                {...register("paymenttype")}
                error={Boolean(errors?.paymenttype)}
                helperText={errors?.paymenttype ? errors?.paymenttype.message : " "}
              >
                {paymentType.map((option) => (
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
                id="billingperiod"
                label="Billing Period"
                {...register("billingperiod")}
                error={Boolean(errors?.billingperiod)}
                helperText={errors?.billingperiod ? errors?.billingperiod.message : " "}
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
                id="intervalcount"
                label="Interval Count"
                {...register("intervalcount")}
                error={Boolean(errors?.intervalcount)}
                helperText={errors?.intervalcount ? errors?.intervalcount.message : " "}
              >
                {intervalCount.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* <TextField
                select
                required
                className='w-full-six h-20 ml-6 border-greyplus'
                margin="dense"
                id="intervalcount"
                label="Interval Count"
                value={selectedValue}
                onChange={handleSelectChange}
                // {...register("intervalcount")}
                // error={Boolean(errors?.intervalcount)}
                // helperText={errors?.intervalcount ? errors?.intervalcount.message : " "}
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
                  id="intervalcount"
                  label="Enter Custom Value for interval count"
                  // {...register("intervalcount")}
                  // error={Boolean(errors?.intervalcount)}
                  // helperText={errors?.intervalcount ? errors?.intervalcount.message : " "}
                />
              )} */}
              <DialogActions>
                <Button
                  className="w-28 h-11 text-white font-Inter font-bold leading-6 normal-case bg-git hover:bg-lightblack"
                  onClick={handleClose}>Cancel</Button>
                <Button
                  className='w-32 h-11 text-white font-Inter font-bold leading-6 normal-case bg-green hover:bg-lightgreen'
                  variant='contained'
                  type="submit"
                  onClick={formHandleSubmit(onSubmit)}
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
          className="text-greyplus mt-2 text-greyplus mt-2 flex justify-center items-center"
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : null}
    </div>
  );
}
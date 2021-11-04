import React from 'react';
import { useFormikContext } from 'formik';

import AppButton from '../AppButton'

function SubmitButton( { title, width } ) {
  const { handleSubmit } = useFormikContext();
  
  return (
    <AppButton
      title={title}
      width={width}
      onPress={handleSubmit}
    />
  );
}



export default SubmitButton;
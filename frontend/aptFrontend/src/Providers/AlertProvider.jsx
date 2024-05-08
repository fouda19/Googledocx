import { createContext, useContext, useState } from 'react';
import Alert from '../components/Alert';

const AlertContext = createContext();
 
console.log('AlertContext', AlertContext);
export const useAlert = () => useContext(AlertContext);

export const AlertProvider = (props) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [trigger, setTrigger] = useState(false);

  return (
    <AlertContext.Provider
      value={{ trigger, setTrigger, setIsError, setAlertMessage }}
    >
      <Alert
        isError={isError}
        message={alertMessage}
        setMessage={setAlertMessage}
        trigger={trigger}
      />
      {props.children}
    </AlertContext.Provider>
  );
};

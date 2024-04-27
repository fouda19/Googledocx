import * as yup from "yup";
import { validationSchema } from "./validateSchema";

const Validation = (type) => {
  const formSchema = {
    login: {
      username: validationSchema["username"],
      password: validationSchema["password"],
    },
    signup: {
      username: validationSchema["username"],
      password: validationSchema["password"],
      email: validationSchema["email"],
      gender: validationSchema["gender"],
      confirmPassword: validationSchema["confirmPassword"],
    },
  };

  const schema = yup.object().shape(formSchema[type]);
  return schema;
};
export default Validation;

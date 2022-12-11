import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  useIonLoading,
  useIonToast,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import API from "../hooks/useAPI";

const Home: React.FC = () => {
  const [present, dismiss] = useIonLoading();
  const [IonToast] = useIonToast();
  const history = useHistory();
  const [auth, setAuth] = useState({
    username: "",
    password: "",
  });

  const showToast = (message: any) => {
    IonToast({
      message: message,
      duration: 1500,
      position: "bottom",
      mode: "ios",
    });
  };

  useEffect(() => {
    if (localStorage.getItem("It's me")) {
      history.push("/member");
    }
  }, []);

  const handleChange = (event: any) => {
    setAuth({ ...auth, [event.target.name]: [event.target.value] });
  };

  const validateForm = () => {
    const { username, password } = auth;
    if (username === "") {
      showToast("Email and Password is required.");
      return false;
    } else if (password === "") {
      showToast("Email and Password is required.");
      return false;
    }
    return true;
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = auth;
      present({
        message: "Login in...",
        spinner: "circles",
      });
      API.post(`/auth/login`, {
        username,
        password,
      })
        .then((response) => {
          if (response.data.status === false) {
            showToast(response.data.msg);
          }
          if (response.data.status === true) {
            localStorage.setItem("It's me", JSON.stringify(response.data.user));

            history.push("/member");
          }
          dismiss();
        })
        .catch((error) => {
          console.log(error);
          showToast(error.message);
          dismiss();
        });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            height: "100%",
          }}
        >
          <IonCard mode="ios">
            <IonCardHeader style={{ textAlign: "center" }}>
              <IonCardTitle>Basic Chat App</IonCardTitle>
              <IonCardSubtitle>Login to communicate</IonCardSubtitle>
            </IonCardHeader>
            <form action="" onSubmit={handleLogin}>
              <IonCard>
                <IonItem lines="none">
                  <IonInput
                    placeholder="username"
                    name="username"
                    onIonChange={handleChange}
                  ></IonInput>
                </IonItem>
              </IonCard>
              <IonCard>
                <IonItem lines="none">
                  <IonInput
                    placeholder="password"
                    name="password"
                    type="password"
                    onIonChange={handleChange}
                  ></IonInput>
                </IonItem>
              </IonCard>
              <IonCard style={{ boxShadow: "none" }}>
                <IonButton expand="block" type="submit">
                  Sign in
                </IonButton>
              </IonCard>
            </form>
            <IonButton
              expand="block"
              fill="clear"
              size="small"
              routerLink="/regis"
              style={{ marginTop: "-1rem" }}
            >
              Sign up
            </IonButton>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

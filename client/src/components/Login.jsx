import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import PropTypes from "prop-types";

function Login({ validSession, setValidSession, setUser }) {
  const [login, setLogin] = useState(validSession);
  const [href, setHref] = useState(`authorization/auth/google`);
  const [inOut, setInOut] = useState(`in`);

  // set component for login/out based on validSession bool.
  useEffect(() => {
    if (validSession) {
      setLogin(true);
      setInOut("out");
      setHref("authorization/logout");
    } else {
      setLogin(false);
      setInOut("in or Sign Up");
      setHref("authorization/auth/google");
    }
  }, [validSession]);


  return (
     <Button
      variant="contained"
      size="large"
      href={href}
      startIcon={<GoogleIcon />}
      sx={{
        background: "linear-gradient(45deg, var(--pink) 30%, var(--blue) 90%)",
        color: "white",
        px: 4,
        py: 1.5,
        borderRadius: "12px",
        textTransform: "none",
        fontSize: "1.1rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          background:
            "linear-gradient(45deg, var(--pink) 50%, var(--blue) 110%)",
        },
      }}
    >
      Sign {inOut} with Google
     </Button>
  );
}

Login.propTypes = {
  validSession: PropTypes.bool.isRequired,
  setValidSession: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Login;

"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import CloseIcon from "@mui/icons-material/Close";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // 🔑 Site Key
  const sitekey = "6LdWMuEqAAAAADCwjSKGQx8i_3fLtJcJG_qkUimg";

  const handleVerifyCaptcha = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        เปิด Dialog
      </Button>

      {/* Popup */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className="flex justify-between items-center">
          <span>ยืนยันว่าไม่ใช่บอท</span>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col items-center">
          <ReCAPTCHA
            sitekey={sitekey}
            onChange={handleVerifyCaptcha}
            asyncScriptOnLoad={() => setRecaptchaLoaded(true)}
          />
          {!recaptchaLoaded && (
            <p className="text-red-500 mt-2">⚠️ โหลด reCAPTCHA ไม่สำเร็จ</p>
          )}
        </DialogContent>

        <DialogActions className="flex justify-center pb-4">
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={() => {
              if (captchaVerified) {
                alert("ยืนยันสำเร็จ! ✅");
                setOpen(false);
              } else {
                alert("กรุณายืนยันว่าไม่ใช่บอท ❌");
              }
            }}
            disabled={!captchaVerified}
            sx={{
              backgroundColor: captchaVerified ? "success.main" : "grey.500",
              "&:hover": {
                backgroundColor: captchaVerified ? "success.dark" : "grey.500",
              },
            }}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

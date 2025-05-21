"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { createUserDocument } from "@/utils/userService";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateField,
  validateAllFields,
  ValidationErrors,
} from "@/utils/validationUtils";
import { getFirebaseErrorMessage } from "@/utils/errorMessages";
import { FiAlertCircle } from "react-icons/fi";

// DUMMY COMMENT

const AuthPage = () => {
  const { user, refreshUserData } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user]);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Update the corresponding state based on input name
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhoneNumber(value);
        break;
      case "street":
        setStreet(value);
        break;
      case "postalCode":
        setPostalCode(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
    }

    // Validate field if it's one we care about
    if (["email", "phone", "postalCode"].includes(name)) {
      const error = validateField(name, value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!isLogin) {
        // Validate all fields for signup
        const errors = validateAllFields({
          email,
          phone: phoneNumber,
          street,
          postalCode,
        });

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return;
        }

        if (password.length < 6) {
          setError("Password should be at least 6 characters long");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        // First create the authentication user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Then create the user document in Firestore
        try {
          await createUserDocument(userCredential.user.uid, {
            firstName,
            lastName,
            email,
            phoneNumber,
            shippingAddress: {
              street,
              city,
              state,
              postalCode: postalCode,
            },
          });

          await refreshUserData();
          router.push("/profile");
        } catch (firestoreError) {
          console.error("Error creating user document:", firestoreError);
          setError(
            "Account created but failed to save profile details. Please update your profile later."
          );
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      try {
        // Always try to create/update the user document
        await createUserDocument(result.user.uid, {
          firstName: result.user.displayName?.split(" ")[0] || "",
          lastName: result.user.displayName?.split(" ")[1] || "",
          email: result.user.email || "",
          phoneNumber: result.user.phoneNumber || "",
          shippingAddress: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
          },
        });

        await refreshUserData();
        router.push("/profile");
      } catch (firestoreError) {
        console.error("Error creating user document:", firestoreError);
        setError("Failed to create user profile. Please try again.");
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err: any) {
      const message = getFirebaseErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const BrandLogo = () => (
    <Link href="/" className="flex items-center justify-center space-x-3 mb-6">
      <div className="w-16 h-16 2xl:w-24 2xl:h-24 rounded-full overflow-hidden">
        <Image
          // src="/images/logo.jpg"
          src="/images/logo5.png"
          alt="Logo"
          width={120}
          height={120}
          className="object-cover brightness-110"
        />
      </div>
      {/* <span className="font-macondo font-bold text-2xl text-bg3 hover:text-bg4 transition-colors">
        The Gifting Affair
      </span> */}
    </Link>
  );

  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
          <BrandLogo />
          <h1 className="text-3xl font-semibold mb-6 font-alegreya text-center">
            Reset Password
          </h1>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 text-xl mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {resetEmailSent ? (
            <div className="text-center">
              <p className="mb-4 text-green-600">
                Password reset email has been sent!
              </p>
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetEmailSent(false);
                }}
                className="text-bg4 hover:underline"
              >
                Return to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  fieldErrors.email ? "border-red-500" : ""
                }`}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm">{fieldErrors.email}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-bg4 text-white py-2 rounded hover:bg-bg4/90 ${
                  isLoading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full text-bg4 hover:underline mt-4"
              >
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <BrandLogo />
        <h1 className="text-3xl font-semibold mb-6 font-alegreya text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 text-xl mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${
              fieldErrors.email ? "border-red-500" : ""
            }`}
            required
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm">{fieldErrors.email}</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />

          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  fieldErrors.phone ? "border-red-500" : ""
                }`}
                required={!isLogin}
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-sm">{fieldErrors.phone}</p>
              )}

              <div className="space-y-2">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={street}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    fieldErrors.street ? "border-red-500" : ""
                  }`}
                  required={!isLogin}
                />
                {fieldErrors.street && (
                  <p className="text-red-500 text-sm">{fieldErrors.street}</p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required={!isLogin}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="Region"
                    value={state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required={!isLogin}
                  />
                </div>

                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    fieldErrors.postalCode ? "border-red-500" : ""
                  }`}
                  required={!isLogin}
                />
                {fieldErrors.postalCode && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.postalCode}
                  </p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-bg4 text-white py-2 rounded hover:bg-bg4/90 relative ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </div>
            ) : isLogin ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {isLogin && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-sm text-bg4 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 p-2 rounded hover:bg-gray-50 ${
            isLoading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          <img src="\images\google-icon.png" alt="Google" className="w-5 h-5" />
          {isLoading ? "Please wait..." : "Continue with Google"}
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-bg4 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>

        <button
          onClick={() => router.push("/")} // Changed from router.back()
          className="mt-4 text-gray-500 hover:underline text-sm w-full text-center"
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
};

export default AuthPage;

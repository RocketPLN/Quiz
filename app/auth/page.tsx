import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import BackgroundEffect from "@/components/backgroundEffect";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Auth() {
  return (
    <>
      <BackgroundEffect />
      <div className="flex items-center justify-center min-h-screen w-screen">
        <Card className="md:w-1/6 bg-card/50 backdrop-blur-lg w-full">
          <Tabs defaultValue="login">
            <CardHeader>
              <CardTitle>
                <TabsList className="flex justify-center bg-muted/50">
                  <TabsTrigger value="login" className="w-1/2">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="w-1/2">
                    Register
                  </TabsTrigger>
                </TabsList>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
}

export default Auth;

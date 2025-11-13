import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { toast } from "sonner";
import { Mail, User, Phone, Save } from "lucide-react";
import settingsBanner from "../admin/imagess/settings.png";

export default function AdminSettings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/user", {
          credentials: "include",
        });

        if (!res.ok) {
          toast.error("Not logged in");
          return;
        }

        const data = await res.json();
        setUser(data);

        setProfile({
          name: data.displayName || "",
          email: data.emails?.[0]?.value || "",
          phone: "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile saved (local only — DB sync coming soon!)");
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // ⭐ Generate stable Google avatar URL
  const avatarUrl = user?.photos?.[0]?.value
    ? user.photos[0].value.replace("=s96-c", "=s256-c")
    : null;

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 md:px-8 py-6 bg-[#F9FAFB] min-h-screen overflow-y-auto">
      
      {/* 🌟 Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-48 sm:h-60 md:h-72 rounded-xl overflow-hidden shadow-lg"
      >
        <img
          src={settingsBanner}
          alt="Settings Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

        <div className="relative flex flex-col justify-center h-full px-6 sm:px-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FFD700] font-playfair mb-2">
            Profile & Account Settings
          </h1>
          <p className="text-sm sm:text-lg text-white/90 font-poppins">
            Manage your admin profile and update your personal details
          </p>
        </div>
      </motion.div>

      {/* 🧍 Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-white border-none rounded-2xl shadow-md">
          <h2 className="font-playfair text-2xl font-bold text-[#2D2D2D] mb-6">
            Profile Settings
          </h2>

          <form onSubmit={handleProfileSave} className="space-y-6">

            {/* Avatar + User Info */}
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20 overflow-hidden rounded-full shadow-md">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/fallback-avatar.png"; // fallback if needed
                    }}
                  />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-[#2D2D2D] text-2xl font-semibold">
                    {profile.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>

              <div>
                <h3 className="text-lg font-semibold text-[#2D2D2D]">
                  {profile.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Signed in with Google ({profile.email})
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed for Google-based accounts.
                </p>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <Label className="text-[#2D2D2D] font-semibold text-sm">
                  Full Name
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email (Locked) */}
              <div>
                <Label className="text-[#2D2D2D] font-semibold text-sm">
                  Email (Google account)
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <Input value={profile.email} disabled />
                </div>
              </div>

              {/* Phone */}
              <div>
                <Label className="text-[#2D2D2D] font-semibold text-sm">
                  Phone Number
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <Input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    placeholder="Add your phone number"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#2D2D2D] font-semibold px-6 py-2 mt-2"
            >
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </form>
        </Card>
      </motion.div>

    </div>
  );
}

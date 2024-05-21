import { TDewAttributes } from "@/types/lens/dew";
import { Profile, ProfileMetadata } from "@lens-protocol/react-web";

export const castLensAttributes = (profile: Profile | undefined) => {
  const keys: TDewAttributes[] = [
    "available",
    "location",
    "website",
    "dew",
    "github",
    "role",
  ];
  const attributes = profile?.metadata?.attributes || [];
  const o = {} as Record<TDewAttributes, string | undefined>;
  if (!attributes) return undefined;
  keys.forEach((key) => {
    const value = searchLensAttributes(key, attributes);
    if (value) o[key] = value;
  });

  return o;
};

export const searchLensAttributes = (
  attribute: TDewAttributes,
  attributes: ProfileMetadata["attributes"]
) => {
  if (!attributes) return;
  return attributes.find((attr) => attr.key === attribute)?.value;
};

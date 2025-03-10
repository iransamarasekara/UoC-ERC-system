const { z } = require("zod");

const userSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(1, "Name required"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(),
});

const userUpdateSchema = z.object({
  email: z.string().email("Valid email required").optional(),
  name: z.string().min(1, "Name required").optional(),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.string().optional(),
  validity: z.boolean().optional(),
});

const applicantSchema = z.object({
  user_id: z.number().int().positive(),
  contact_details: z.string().optional(),
  applicant_category: z.string().min(1, "Category required"),
  registration_date: z.date(),
});

const applicantUpdateSchema = z.object({
  user_id: z.number().int().positive().optional(),
  contact_details: z.string().optional(),
  applicant_category: z.string().optional(),
  registration_date: z.date().optional(),
});

const committeeMemberSchema = z.object({
  user_id: z.number().int().positive(),
  committee_id: z.number().int().positive(),
  role: z.string().min(1, "Role required"),
  is_active: z.boolean().default(true),
});

const committeeMemberUpdateSchema = z.object({
  user_id: z.number().int().positive().optional(),
  committee_id: z.number().int().positive().optional(),
  role: z.string().optional(),
  is_active: z.boolean().optional(),
});

module.exports = {
  userSchema,
  userUpdateSchema,
  applicantSchema,
  applicantUpdateSchema,
  committeeMemberSchema,
  committeeMemberUpdateSchema,
};

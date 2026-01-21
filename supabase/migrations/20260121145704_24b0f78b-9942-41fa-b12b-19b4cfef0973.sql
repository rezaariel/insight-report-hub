-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Divisi HRD reports
CREATE TABLE public.reports_hrd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    periode VARCHAR(50) NOT NULL,
    upah_produksi DECIMAL(15,2) DEFAULT 0,
    upah_lainnya DECIMAL(15,2) DEFAULT 0,
    sewa_tanah DECIMAL(15,2) DEFAULT 0,
    sewa_gedung DECIMAL(15,2) DEFAULT 0,
    biaya_logistik DECIMAL(15,2) DEFAULT 0,
    biaya_rnd DECIMAL(15,2) DEFAULT 0,
    tk_pria_tetap INT DEFAULT 0,
    tk_pria_tidak_tetap INT DEFAULT 0,
    tk_wanita_tetap INT DEFAULT 0,
    tk_wanita_tidak_tetap INT DEFAULT 0,
    edu_sd INT DEFAULT 0,
    edu_smp INT DEFAULT 0,
    edu_sma INT DEFAULT 0,
    edu_d3 INT DEFAULT 0,
    edu_s1 INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, periode)
);

-- 5. Divisi ACC reports
CREATE TABLE public.reports_acc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    periode VARCHAR(50) NOT NULL,
    bahan_baku_awal DECIMAL(15,2) DEFAULT 0,
    bahan_baku_akhir DECIMAL(15,2) DEFAULT 0,
    barang_jadi_awal DECIMAL(15,2) DEFAULT 0,
    barang_jadi_akhir DECIMAL(15,2) DEFAULT 0,
    inv_tanah DECIMAL(15,2) DEFAULT 0,
    inv_bangunan DECIMAL(15,2) DEFAULT 0,
    inv_mesin DECIMAL(15,2) DEFAULT 0,
    pct_asing INT DEFAULT 0,
    negara_asal_asing VARCHAR(100),
    status_produksi VARCHAR(10) DEFAULT 'Ya',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, periode)
);

-- 6. Divisi PCC reports
CREATE TABLE public.reports_pcc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    periode VARCHAR(50) NOT NULL,
    nama_mesin VARCHAR(255),
    merk_tipe VARCHAR(255),
    tahun_buat INT,
    nama_produk VARCHAR(255),
    kbli_kode VARCHAR(20),
    hs_kode VARCHAR(20),
    kapasitas_terpasang_thn INT DEFAULT 0,
    produksi_riil_thn INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, periode)
);

-- 7. Divisi GA reports
CREATE TABLE public.reports_ga (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    periode VARCHAR(50) NOT NULL,
    limbah_cair_inlet FLOAT DEFAULT 0,
    limbah_cair_outlet FLOAT DEFAULT 0,
    cod_inlet FLOAT DEFAULT 0,
    cod_outlet FLOAT DEFAULT 0,
    b3_majun_ton FLOAT DEFAULT 0,
    b3_air_ton FLOAT DEFAULT 0,
    padat_logam_ton FLOAT DEFAULT 0,
    padat_domestik_ton FLOAT DEFAULT 0,
    listrik_pln_kwh FLOAT DEFAULT 0,
    listrik_non_pln_kwh FLOAT DEFAULT 0,
    air_pdam_m3 FLOAT DEFAULT 0,
    biaya_air_rp DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, periode)
);

-- 8. Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_hrd ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_acc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_pcc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_ga ENABLE ROW LEVEL SECURITY;

-- 9. Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 10. RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 11. RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 12. RLS Policies for reports_hrd
CREATE POLICY "Users can manage their own HRD reports"
ON public.reports_hrd FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all HRD reports"
ON public.reports_hrd FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 13. RLS Policies for reports_acc
CREATE POLICY "Users can manage their own ACC reports"
ON public.reports_acc FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all ACC reports"
ON public.reports_acc FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 14. RLS Policies for reports_pcc
CREATE POLICY "Users can manage their own PCC reports"
ON public.reports_pcc FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all PCC reports"
ON public.reports_pcc FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 15. RLS Policies for reports_ga
CREATE POLICY "Users can manage their own GA reports"
ON public.reports_ga FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all GA reports"
ON public.reports_ga FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 16. Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_hrd_updated_at
BEFORE UPDATE ON public.reports_hrd
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_acc_updated_at
BEFORE UPDATE ON public.reports_acc
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_pcc_updated_at
BEFORE UPDATE ON public.reports_pcc
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_ga_updated_at
BEFORE UPDATE ON public.reports_ga
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 17. Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
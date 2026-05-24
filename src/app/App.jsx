import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../admin/routes/ProtectedRoute";
import PermissionGuard from "../admin/components/PermissionGuard";
import hasPermission from "../admin/helper/hasPermision";
import { useAuth } from "../context/AuthContext";

import MainLayout from "../components/layout/MainLayout";
import Loading from "../components/loading/Loading";
import ContentLayout from "../layouts/ContentLayout/ContentLayout";

const Home = lazy(() => import("../pages/Home/Home"));
const PublicPage = lazy(() => import("../features/public-pages/pages/PublicPage"));
const NewsListPage = lazy(() => import("../features/news/pages/NewsListPage"));
const GalleryAlbumsPage = lazy(() => import("../features/gallery/pages/GalleryAlbumsPage"));
const GalleryAlbumPage = lazy(() => import("../features/gallery/pages/GalleryAlbumPage"));
const UiPreviewPage = lazy(() => import("../features/ui-preview/UiPreviewPage"));

const AdminLayout = lazy(() => import("../admin/layout/AdminLayout"));
const AuthLayout = lazy(() => import("../admin/auth/AuthLayout"));
const Dashboard = lazy(() => import("../admin/pages/Dashboard"));
const WebDashboard = lazy(() => import("../admin/pages/WebDashboard"));
const UsersPanel = lazy(() => import("../admin/pages/users/UserPanel"));
const SettingsPage = lazy(() => import("../admin/pages/SettingsPage"));
const Unauthorized = lazy(() => import("../admin/pages/Unauthorized"));
const HeroSlidesPage = lazy(() => import("../admin/pages/HeroSlidesPage"));
const DailyVersesPage = lazy(() => import("../admin/pages/DailyVersesPage"));
const DynamicPagesPage = lazy(() => import("../admin/pages/DynamicPagesPage"));
const NavigationPage = lazy(() => import("../admin/pages/NavigationPage"));
const HomeSectionsPage = lazy(() => import("../admin/pages/HomeSectionsPage"));
const SiteSettingsPage = lazy(() => import("../admin/pages/SiteSettingsPage"));
const MediaLibraryPage = lazy(() => import("../admin/pages/MediaLibraryPage"));
const GalleryAdminPage = lazy(() => import("../admin/pages/GalleryAdminPage"));

const SecretariaLayout = lazy(() => import("../admin/pages/secretaria/SecretariaLayout"));
const BoardListPage = lazy(() => import("../admin/pages/secretaria/pages/BoardListPage"));
const BoardFormPage = lazy(() => import("../admin/pages/secretaria/pages/BoardFormPage"));
const BoardDetailPage = lazy(() => import("../admin/pages/secretaria/pages/BoardDetailPage"));
const BoardPrintPage = lazy(() => import("../admin/pages/secretaria/pages/BoardPrintPage"));

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const role = user?.role;

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route
            path="pagina/:slug"
            element={
              <ContentLayout>
                <PublicPage />
              </ContentLayout>
            }
          />
          <Route
            path="noticias"
            element={
              <ContentLayout>
                <NewsListPage />
              </ContentLayout>
            }
          />
          <Route
            path="galeria"
            element={
              <ContentLayout>
                <GalleryAlbumsPage />
              </ContentLayout>
            }
          />
          <Route
            path="galeria/:slug"
            element={
              <ContentLayout>
                <GalleryAlbumPage />
              </ContentLayout>
            }
          />
          {/* Ruta temporal de desarrollo para validar componentes UI públicos. */}
          <Route path="ui-preview" element={<UiPreviewPage />} />
        </Route>

        {/* LOGIN ADMIN */}
        <Route path="/admin/login" element={<AuthLayout />} />

        {/* RUTAS ADMIN CON PROTECCIÓN */}
        <Route
          path="/admin/secretaria/boards/:id/print"
          element={
            <ProtectedRoute>
              <PermissionGuard can={hasPermission(role, ["admin", "secretaria"])}>
                <BoardPrintPage />
              </PermissionGuard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route
            path="web"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <WebDashboard />
              </PermissionGuard>
            }
          />

          <Route
            path="settings"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <SettingsPage />
              </PermissionGuard>
            }
          />

          <Route
            path="users"
            element={
              <PermissionGuard can={hasPermission(role, ["admin", "secretaria"])}>
                <UsersPanel />
              </PermissionGuard>
            }
          />

          <Route
            path="hero-slides"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <HeroSlidesPage />
              </PermissionGuard>
            }
          />

          <Route
            path="daily-verses"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <DailyVersesPage />
              </PermissionGuard>
            }
          />

          <Route
            path="pages"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <DynamicPagesPage />
              </PermissionGuard>
            }
          />

          <Route
            path="navigation"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <NavigationPage />
              </PermissionGuard>
            }
          />

          <Route
            path="home-sections"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <HomeSectionsPage />
              </PermissionGuard>
            }
          />

          <Route
            path="site-settings"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <SiteSettingsPage />
              </PermissionGuard>
            }
          />

          <Route
            path="media"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <MediaLibraryPage />
              </PermissionGuard>
            }
          />

          <Route
            path="gallery"
            element={
              <PermissionGuard can={hasPermission(role, ["admin"])}>
                <GalleryAdminPage />
              </PermissionGuard>
            }
          />

          <Route path="unauthorized" element={<Unauthorized />} />
          <Route
            path="secretaria"
            element={
              <PermissionGuard can={hasPermission(role, ["admin", "secretaria"])}>
                <SecretariaLayout />
              </PermissionGuard>
            }
          >
            {/* LISTADO PRINCIPAL */}
            <Route index element={<BoardListPage />} />

            {/* JUNTAS */}
            <Route path="boards">
              <Route path="new" element={<BoardFormPage />} />
              <Route path=":id" element={<BoardDetailPage />} />
              <Route path=":id/edit" element={<BoardFormPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

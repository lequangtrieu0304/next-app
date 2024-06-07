import Container from "@/app/components/Container";
import Link from "next/link";
import CartCount from "@/app/components/nav/CartCount";
import UserMenu from "@/app/components/nav/UserMenu";
import {getCurrentUser} from "@/actions/getCurrentUser";
import {SafeUser} from "@/types";

const NavBar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="sticky top-0 w-full bg-slate-200 z-30 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link href="/">Next Shop</Link>
            <div className="hidden md:block">Search</div>
            <div className="flex items-center gap-8 md:gap-12">
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default NavBar;
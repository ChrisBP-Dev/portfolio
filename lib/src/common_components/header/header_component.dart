import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/common_components/header/animated_menu_container.dart';
import 'package:portfolio/src/common_components/header/custom_menu_item.dart';
import 'package:portfolio/src/common_components/header/header_logo.dart';
import 'package:portfolio/src/common_components/header/header_menu_controller.dart';
import 'package:portfolio/src/common_widgets/responsive_center.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/constants/breakpoints.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_route.dart';

class HeaderComponent extends ConsumerWidget {
  const HeaderComponent({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const heigthHeader = 82.0;
    final screenWidth = MediaQuery.sizeOf(context).width;
    final isTablet = screenWidth <= Breakpoint.tablet;
    final isOpen = ref.watch(headerMenuControllerProvider);

    return PinnedHeaderSliver(
      child: AnimatedContainer(
        duration: kanimationDuration,
        height: isOpen ? heigthHeader + 150 : heigthHeader,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            if (isTablet)
              const Positioned(
                left: 0,
                right: 0,
                top: heigthHeader,
                child: AnimatedMenuContainer(),
              ),
            Positioned(
              height: heigthHeader,
              top: 0,
              left: 0,
              right: 0,
              child: ResponsiveHeader(isTablet: isTablet, isOpen: isOpen),
            ),
          ],
        ),
      ),
    );
  }
}

class ResponsiveHeader extends StatelessWidget {
  const ResponsiveHeader({
    required this.isTablet,
    required this.isOpen,
    super.key,
  });

  final bool isTablet;
  final bool isOpen;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Theme.of(context).cardColor,
      child: ResponsiveCenter(
        padding: const EdgeInsets.symmetric(
          horizontal: Sizes.globalPadding,
        ),
        child: Row(
          children: [
            const HeaderLogo(),
            const Spacer(),
            if (!isTablet) ...[
              CustomMenuItem(
                title: context.l10n.homeTitle,
                path: AppRoute.home.path,
              ),
              CustomMenuItem(
                title: context.l10n.projectsTitle,
                path: AppRoute.projects.path,
              ),
              CustomMenuItem(
                title: context.l10n.contactTitle,
                path: AppRoute.contact.path,
              ),
            ],
            if (isTablet) ...[
              Consumer(
                builder: (context, ref, _) {
                  return IconButton(
                    icon: Icon(
                      isOpen ? Icons.close : Icons.menu,
                      color: Colors.white,
                    ),
                    onPressed: () {
                      ref
                          .read(headerMenuControllerProvider.notifier)
                          .toggleMenu();
                    },
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/common_components/admin/admin_drawer.dart';
import 'package:portfolio/src/core/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/core/common_widgets/responsive_widget.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/features/auth/domain/auth_repository.dart';
import 'package:portfolio/src/features/settings/presentation/switch_locale_widget.dart';
import 'package:portfolio/src/features/settings/presentation/switch_theme_widget.dart';

class FullPageContainer extends ConsumerStatefulWidget {
  const FullPageContainer({
    required this.page,
    super.key,
  });
  final Widget page;

  @override
  ConsumerState<FullPageContainer> createState() => _FullPageContainerState();
}

class _FullPageContainerState extends ConsumerState<FullPageContainer> {
  @override
  Widget build(BuildContext context) {
    return AsyncValueWidget(
      value: ref.watch(authStateChangesProvider),
      data: (admin) {
        final isAdmin = admin != null;
        return Scaffold(
          drawer: isAdmin.whenOrNull(isTrue: AdminDrawer.new),
          body: isAdmin.when(
            isTrue: () => ResponsiveWidget(
              mobile: widget.page,
              desktop: Row(
                children: [
                  AdminDrawer(onPageSelected: () => setState(() {})),
                  Expanded(child: widget.page),
                ],
              ),
            ),
            isFalse: () => widget.page,
          ),
          floatingActionButton: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              if (isAdmin) ...[
                ResponsiveWidget(
                  mobile: Builder(
                    builder: (context) {
                      return FloatingActionButton(
                        onPressed: () => Scaffold.of(context).openDrawer(),
                        child: const Icon(Icons.menu),
                      );
                    },
                  ),
                  desktop: const SizedBox.shrink(),
                ),
                gapH14,
              ],
              const SwitchThemeWidget(),
              gapH14,
              const SwitchLocaleWidget(),
            ],
          ),
        );
      },
    );
  }
}

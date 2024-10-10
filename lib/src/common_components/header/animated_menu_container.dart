import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/common_components/header/header_menu_controller.dart';
import 'package:portfolio/src/common_components/header/mobile_menu_item.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_route.dart';

const kanimationDuration = Duration(milliseconds: 400);
const kMenuContainerHeight = 150.0;

class AnimatedMenuContainer extends ConsumerStatefulWidget {
  const AnimatedMenuContainer({super.key});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() =>
      _AnimatedHeaderContainerState();
}

class _AnimatedHeaderContainerState extends ConsumerState<AnimatedMenuContainer>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller =
        AnimationController(vsync: this, duration: kanimationDuration);
    _animation = Tween<double>(begin: -kMenuContainerHeight, end: 0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<bool>(headerMenuControllerProvider, (previous, next) {
      if (next) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
    final theme = Theme.of(context);

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) => Transform.translate(
        offset: Offset(0, _animation.value),
        child: AnimatedOpacity(
          opacity: _controller.value,
          duration: kanimationDuration,
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(),
              boxShadow: [
                BoxShadow(
                  color: theme.colorScheme.primary.withOpacity(0.2),
                  spreadRadius: 5,
                  blurRadius: 7,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            width: MediaQuery.of(context).size.width,
            child: Column(
              children: [
                MobileMenuItem(
                  title: context.l10n.homeTitle,
                  path: AppRoute.home.path,
                ),
                MobileMenuItem(
                  title: context.l10n.projectsTitle,
                  path: AppRoute.projects.path,
                ),
                MobileMenuItem(
                  title: context.l10n.contactTitle,
                  path: AppRoute.contact.path,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
